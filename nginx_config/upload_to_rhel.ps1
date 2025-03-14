# PowerShell script to upload NGINX configuration files to RHEL server
# You need to modify these variables to match your server details

# Variables - update these according to your environment
$RHEL_SERVER = "your-rhel-server.example.com"  # Update with your server hostname or IP
$RHEL_USER = "your-username"  # Update with your SSH username
$SSH_KEY_PATH = "C:\path\to\your\private_key.pem"  # Update with your SSH key path
$REMOTE_PATH = "/tmp/nginx_config"  # Temporary path on the remote server

Write-Host "NGINX Configuration Upload Script for RHEL"
Write-Host "=========================================="
Write-Host ""
Write-Host "This script will upload the configuration files to your RHEL server."
Write-Host "Please ensure you have setup SSH key authentication to your server."
Write-Host ""

# Prepare configuration files
Write-Host "Making script executable..."
(Get-Content -Path "nginx_config/install_on_rhel.sh") -replace "`r`n", "`n" | Set-Content -Path "nginx_config/install_on_rhel.sh" -NoNewline

# Create upload command
$uploadCmd = "scp -i `"$SSH_KEY_PATH`" -r nginx_config/* $RHEL_USER@$RHEL_SERVER`:$REMOTE_PATH/"

# Create execution command
$execCmd = "ssh -i `"$SSH_KEY_PATH`" $RHEL_USER@$RHEL_SERVER `"cd $REMOTE_PATH && chmod +x install_on_rhel.sh && ./install_on_rhel.sh`""

Write-Host "Upload command:"
Write-Host $uploadCmd
Write-Host ""
Write-Host "Execution command (after uploading):"
Write-Host $execCmd
Write-Host ""
Write-Host "To run these commands:"
Write-Host "1. Ensure you've updated the variables at the top of this script"
Write-Host "2. Run the upload command to copy files to the server"
Write-Host "3. Run the execution command to install and configure NGINX"
Write-Host ""
Write-Host "Or uncomment and run the following lines:"
Write-Host "# Create remote directory"
Write-Host "# ssh -i `"$SSH_KEY_PATH`" $RHEL_USER@$RHEL_SERVER `"mkdir -p $REMOTE_PATH`""
Write-Host "# Upload files"
Write-Host "# $uploadCmd"
Write-Host "# Execute installation script"
Write-Host "# $execCmd" 