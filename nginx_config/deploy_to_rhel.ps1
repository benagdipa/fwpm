# RHEL Production Deployment Script
param (
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$true)]
    [string]$Username,
    
    [Parameter(Mandatory=$true)]
    [string]$SshKeyPath,
    
    [Parameter(Mandatory=$false)]
    [string]$RemotePath = "/var/www/fwpm",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild = $false
)

Write-Host "Preparing to deploy FWPM to RHEL production server at $ServerIP..." -ForegroundColor Cyan

# Ensure we have the .env.production file
if (-not (Test-Path ".env.production")) {
    Write-Host "Error: .env.production file not found. Please create it first." -ForegroundColor Red
    exit 1
}

# Check if SSH key exists
if (-not (Test-Path $SshKeyPath)) {
    Write-Host "Error: SSH key not found at $SshKeyPath" -ForegroundColor Red
    exit 1
}

# Check if ssh command is available
$sshAvailable = Get-Command ssh -ErrorAction SilentlyContinue
if (-not $sshAvailable) {
    Write-Host "Error: ssh command not found. Please install OpenSSH Client." -ForegroundColor Red
    exit 1
}

# Check if scp command is available
$scpAvailable = Get-Command scp -ErrorAction SilentlyContinue
if (-not $scpAvailable) {
    Write-Host "Error: scp command not found. Please install OpenSSH Client." -ForegroundColor Red
    exit 1
}

# Build Next.js application if not skipped
if (-not $SkipBuild) {
    Write-Host "Building Next.js application..." -ForegroundColor Yellow
    Set-Location -Path ../fwpm_frontend
    npm ci
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to build Next.js application." -ForegroundColor Red
        Set-Location -Path ../nginx_config
        exit 1
    }
    Set-Location -Path ../nginx_config
}

# Create a temporary directory
$tempDir = Join-Path $env:TEMP "fwpm_deploy_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# Create deploy script for the remote server
$deployScript = @"
#!/bin/bash
set -e

# Ensure we have correct permissions
sudo chown -R www-data:www-data $RemotePath

# Set environment variables
export DJANGO_ENV="production"
export NODE_ENV="production"

# Activate virtual environment
cd $RemotePath
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt gunicorn

# Run Django migrations
echo "Running Django migrations..."
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Setup Gunicorn service
echo "Setting up Gunicorn service..."
sudo cp $RemotePath/gunicorn.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable gunicorn

# Setup NextJS service
echo "Setting up NextJS service..."
sudo cp $RemotePath/nginx_config/nextjs.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable nextjs

# Setup Nginx
echo "Setting up Nginx..."
if [ -f "/etc/nginx/conf.d/fwpm_app.conf" ]; then
    sudo mv /etc/nginx/conf.d/fwpm_app.conf /etc/nginx/conf.d/fwpm_app.conf.bak
fi
sudo cp $RemotePath/nginx_config/fwpm_app.conf /etc/nginx/conf.d/
sudo nginx -t
if [ \$? -eq 0 ]; then
    echo "Nginx configuration test successful."
    sudo systemctl restart nginx
else
    echo "Nginx configuration test failed. Please check the configuration."
    exit 1
fi

# Restart services
echo "Restarting services..."
sudo systemctl restart gunicorn
sudo systemctl restart nextjs

echo "Deployment completed successfully!"
"@

# Write deploy script to temp directory
$deployScriptPath = Join-Path $tempDir "deploy.sh"
Set-Content -Path $deployScriptPath -Value $deployScript

# Create a tar file excluding unnecessary files
$excludeList = @(
    "./venv/*", 
    "./node_modules/*", 
    "./.git/*", 
    "./logs/*", 
    "./.next/*", 
    "./.vscode/*", 
    "./__pycache__/*", 
    "*.pyc"
)

Write-Host "Creating deployment package..." -ForegroundColor Yellow
Set-Location -Path ../
$excludeArgs = $excludeList | ForEach-Object { "--exclude=$_" }
$tarCmd = "tar -czf $tempDir/fwpm_deploy.tar.gz $excludeArgs ./"
Invoke-Expression $tarCmd
Set-Location -Path nginx_config

# Transfer files to server
Write-Host "Uploading files to server..." -ForegroundColor Yellow
$scpOptions = "-i ""$SshKeyPath"" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
Invoke-Expression "scp $scpOptions $tempDir/fwpm_deploy.tar.gz $Username@$ServerIP:/tmp/"
Invoke-Expression "scp $scpOptions $deployScriptPath $Username@$ServerIP:/tmp/"

# Execute deployment on server
Write-Host "Executing deployment on server..." -ForegroundColor Yellow
$sshCmd = "ssh -i ""$SshKeyPath"" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $Username@$ServerIP ""sudo mkdir -p $RemotePath && sudo chmod +x /tmp/deploy.sh && cd /tmp && sudo tar -xzf fwpm_deploy.tar.gz -C $RemotePath && /tmp/deploy.sh"""
Invoke-Expression $sshCmd

# Clean up temporary directory
Write-Host "Cleaning up temporary files..." -ForegroundColor Yellow
Remove-Item -Recurse -Force $tempDir

Write-Host "`nDeployment to RHEL production server completed!" -ForegroundColor Green
Write-Host "Application should be accessible at: https://fwpm.nwas.nbnco.net.au" -ForegroundColor Green
Write-Host "Remember to check server logs if there are any issues:" -ForegroundColor Yellow
Write-Host "  - sudo journalctl -u gunicorn"
Write-Host "  - sudo journalctl -u nextjs"
Write-Host "  - sudo tail -f /var/log/nginx/error.log" 