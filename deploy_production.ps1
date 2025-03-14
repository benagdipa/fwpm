# Production Deployment Script
# This script prepares and deploys the application to production

Write-Host "FWPM Production Deployment Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Function to check if a command exists
function Test-CommandExists {
    param ($command)
    $exists = $null
    try {
        $exists = Get-Command $command -ErrorAction Stop
    } catch {
        $exists = $false
    }
    return $exists
}

# Check prerequisites
Write-Host "`nChecking prerequisites..." -ForegroundColor Cyan
$prerequisites = @{
    "python" = "Python is required for the backend"
    "pip" = "Pip is required for Python package management"
    "node" = "Node.js is required for the frontend"
    "npm" = "NPM is required for Node.js package management"
}

$allPrerequisitesMet = $true
foreach ($prereq in $prerequisites.Keys) {
    if (Test-CommandExists $prereq) {
        Write-Host "✓ $prereq is installed" -ForegroundColor Green
    } else {
        Write-Host "✗ $prereq is not installed - $($prerequisites[$prereq])" -ForegroundColor Red
        $allPrerequisitesMet = $false
    }
}

if (-not $allPrerequisitesMet) {
    Write-Host "`nPlease install all prerequisites before continuing." -ForegroundColor Red
    exit 1
}

# Switch to production environment
Write-Host "`nSwitching to production environment..." -ForegroundColor Cyan
if (Test-Path ".env.production") {
    Copy-Item -Path ".env.production" -Destination ".env" -Force
    Write-Host "✓ Production environment activated" -ForegroundColor Green
} else {
    Write-Host "✗ Production environment file (.env.production) not found" -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host "`nInstalling backend dependencies..." -ForegroundColor Cyan
pip install -r requirements.txt
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Apply database migrations
Write-Host "`nApplying database migrations..." -ForegroundColor Cyan
python manage.py migrate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database migrations applied" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to apply database migrations" -ForegroundColor Red
    exit 1
}

# Collect static files
Write-Host "`nCollecting static files..." -ForegroundColor Cyan
python manage.py collectstatic --noinput
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Static files collected" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to collect static files" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "`nInstalling frontend dependencies..." -ForegroundColor Cyan
Set-Location -Path "fwpm_frontend"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}

# Build frontend
Write-Host "`nBuilding frontend..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend built successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to build frontend" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}

# Return to root directory
Set-Location -Path ".."

# Restart services
Write-Host "`nRestarting services..." -ForegroundColor Cyan
try {
    # Restart Gunicorn service
    if (Test-Path "/etc/systemd/system/fwpm-django.service") {
        Write-Host "Restarting Gunicorn service..." -ForegroundColor Yellow
        systemctl restart fwpm-django
        systemctl status fwpm-django
    } else {
        Write-Host "Gunicorn service not found, skipping restart" -ForegroundColor Yellow
    }

    # Restart Nginx service
    if (Test-CommandExists "nginx") {
        Write-Host "Restarting Nginx service..." -ForegroundColor Yellow
        systemctl restart nginx
        systemctl status nginx
    } else {
        Write-Host "Nginx not found, skipping restart" -ForegroundColor Yellow
    }

    Write-Host "✓ Services restarted" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to restart services: $_" -ForegroundColor Red
}

# Verify deployment
Write-Host "`nVerifying deployment..." -ForegroundColor Cyan
./verify_deployment.ps1

Write-Host "`nDeployment completed!" -ForegroundColor Green
Write-Host "Your application should now be accessible at the configured URL." -ForegroundColor Green
Write-Host "If you encounter any issues, check the logs in the logs/ directory." -ForegroundColor Yellow 