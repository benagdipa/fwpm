# PowerShell script to deploy NGINX configuration on RHEL

# Variables - modify these according to your environment
$PROJECT_ROOT = "/path/to/your/project"  # Replace with the absolute path to your project
$STATIC_ROOT = "$PROJECT_ROOT/staticfiles"
$MEDIA_ROOT = "$PROJECT_ROOT/media"
$DOMAIN_NAME = "your-domain.com"  # Replace with your actual domain name

# Update paths in the configuration file
(Get-Content -Path "nginx_config/fwpm_app.conf") -replace 'server_name your-domain\.com', "server_name $DOMAIN_NAME" | 
    Set-Content -Path "nginx_config/fwpm_app.conf.tmp"

(Get-Content -Path "nginx_config/fwpm_app.conf.tmp") -replace '/path/to/your/project/staticfiles/', "$STATIC_ROOT/" | 
    Set-Content -Path "nginx_config/fwpm_app.conf.tmp2"

(Get-Content -Path "nginx_config/fwpm_app.conf.tmp2") -replace '/path/to/your/project/media/', "$MEDIA_ROOT/" | 
    Set-Content -Path "nginx_config/fwpm_app.conf"

# Clean up temporary files
Remove-Item -Path "nginx_config/fwpm_app.conf.tmp"
Remove-Item -Path "nginx_config/fwpm_app.conf.tmp2"

Write-Host "Configuration files prepared with your settings."
Write-Host "To deploy to your RHEL server, run the following commands:"
Write-Host ""
Write-Host "# On RHEL server:"
Write-Host "sudo dnf install nginx -y"
Write-Host "sudo cp $PROJECT_ROOT/nginx_config/nginx.conf /etc/nginx/nginx.conf"
Write-Host "sudo cp $PROJECT_ROOT/nginx_config/fwpm_app.conf /etc/nginx/conf.d/fwpm_app.conf"
Write-Host "sudo mkdir -p $STATIC_ROOT"
Write-Host "sudo mkdir -p $MEDIA_ROOT"
Write-Host "sudo chown -R nginx:nginx $STATIC_ROOT"
Write-Host "sudo chown -R nginx:nginx $MEDIA_ROOT"
Write-Host "sudo chmod -R 755 $STATIC_ROOT"
Write-Host "sudo chmod -R 755 $MEDIA_ROOT"
Write-Host ""
Write-Host "# Test NGINX configuration:"
Write-Host "sudo nginx -t"
Write-Host ""
Write-Host "# Apply SELinux context (important on RHEL):"
Write-Host "sudo chcon -R -t httpd_sys_content_t $STATIC_ROOT"
Write-Host "sudo chcon -R -t httpd_sys_content_t $MEDIA_ROOT"
Write-Host ""
Write-Host "# Start and enable NGINX:"
Write-Host "sudo systemctl start nginx"
Write-Host "sudo systemctl enable nginx"
Write-Host ""
Write-Host "# Configure firewall:"
Write-Host "sudo firewall-cmd --permanent --add-service=http"
Write-Host "sudo firewall-cmd --permanent --add-service=https"
Write-Host "sudo firewall-cmd --reload" 