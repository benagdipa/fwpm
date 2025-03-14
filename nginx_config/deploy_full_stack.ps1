# PowerShell script to deploy the full stack on RHEL

# Variables - updated with correct paths
$PROJECT_ROOT = "/var/www/fwpm"
$BACKEND_ROOT = "$PROJECT_ROOT/fwpm_backend"
$STATIC_ROOT = "$BACKEND_ROOT/staticfiles"
$MEDIA_ROOT = "$BACKEND_ROOT/media"
$DOMAIN_NAME = "fwpm.nwas.nbnco.net.au"

Write-Host "Full Stack Deployment Script for Django & NextJS on RHEL"
Write-Host "========================================================"
Write-Host ""
Write-Host "This script will prepare the deployment files. On your RHEL server,"
Write-Host "you will need to run the generated commands to complete the installation."
Write-Host ""

# Update paths in configuration files
(Get-Content -Path "nginx_config/fwpm_app.conf") -replace 'server_name fwpm\.nwas\.nbnco\.net\.au', "server_name $DOMAIN_NAME" | 
    Set-Content -Path "nginx_config/fwpm_app.conf.tmp"

(Get-Content -Path "nginx_config/fwpm_app.conf.tmp") -replace '/var/www/fwpm/fwpm_backend/staticfiles/', "$STATIC_ROOT/" | 
    Set-Content -Path "nginx_config/fwpm_app.conf.tmp2"

(Get-Content -Path "nginx_config/fwpm_app.conf.tmp2") -replace '/var/www/fwpm/fwpm_backend/media/', "$MEDIA_ROOT/" | 
    Set-Content -Path "nginx_config/fwpm_app.conf"

# Update paths in Django service file
(Get-Content -Path "nginx_config/django_gunicorn.service") -replace '/var/www/fwpm/fwpm_backend', "$BACKEND_ROOT" | 
    Set-Content -Path "nginx_config/django_gunicorn.service.tmp"

(Get-Content -Path "nginx_config/django_gunicorn.service.tmp") -replace '/var/www/fwpm/venv', "$PROJECT_ROOT/venv" | 
    Set-Content -Path "nginx_config/django_gunicorn.service"

# Update paths in NextJS service file
(Get-Content -Path "nginx_config/nextjs.service") -replace '/var/www/fwpm', "$PROJECT_ROOT" | 
    Set-Content -Path "nginx_config/nextjs.service"

# Clean up temporary files
Remove-Item -Path "nginx_config/fwpm_app.conf.tmp" -ErrorAction SilentlyContinue
Remove-Item -Path "nginx_config/fwpm_app.conf.tmp2" -ErrorAction SilentlyContinue
Remove-Item -Path "nginx_config/django_gunicorn.service.tmp" -ErrorAction SilentlyContinue

Write-Host "Configuration files prepared with your settings."
Write-Host ""
Write-Host "To deploy to your RHEL server, run the following commands:"
Write-Host ""
Write-Host "# 1. Install required packages"
Write-Host "sudo dnf update -y"
Write-Host "sudo dnf install nginx python3 python3-pip nodejs npm -y"
Write-Host ""
Write-Host "# 2. Copy NGINX configuration"
Write-Host "sudo cp $PROJECT_ROOT/nginx_config/nginx.conf /etc/nginx/nginx.conf"
Write-Host "sudo cp $PROJECT_ROOT/nginx_config/fwpm_app.conf /etc/nginx/conf.d/fwpm_app.conf"
Write-Host ""
Write-Host "# 3. Set up Django with Gunicorn"
Write-Host "cd $PROJECT_ROOT"
Write-Host "python3 -m venv venv"
Write-Host "./venv/bin/pip install -r requirements.txt"
Write-Host "./venv/bin/pip install gunicorn"
Write-Host "sudo cp $PROJECT_ROOT/nginx_config/django_gunicorn.service /etc/systemd/system/"
Write-Host ""
Write-Host "# 4. Set up NextJS"
Write-Host "cd $PROJECT_ROOT/fwpm_frontend"
Write-Host "npm install"
Write-Host "npm run build"
Write-Host "sudo cp $PROJECT_ROOT/nginx_config/nextjs.service /etc/systemd/system/"
Write-Host ""
Write-Host "# 5. Create directories and set permissions"
Write-Host "sudo mkdir -p $STATIC_ROOT"
Write-Host "sudo mkdir -p $MEDIA_ROOT"
Write-Host "cd $BACKEND_ROOT"
Write-Host "../venv/bin/python manage.py collectstatic --noinput"
Write-Host "sudo chown -R www-data:www-data $STATIC_ROOT"
Write-Host "sudo chown -R www-data:www-data $MEDIA_ROOT"
Write-Host "sudo chmod -R 755 $STATIC_ROOT"
Write-Host "sudo chmod -R 755 $MEDIA_ROOT"
Write-Host ""
Write-Host "# 6. Apply SELinux context (important on RHEL)"
Write-Host "sudo chcon -R -t httpd_sys_content_t $STATIC_ROOT"
Write-Host "sudo chcon -R -t httpd_sys_content_t $MEDIA_ROOT"
Write-Host "sudo chcon -R -t httpd_sys_rw_content_t $MEDIA_ROOT"
Write-Host ""
Write-Host "# 7. Start and enable services"
Write-Host "sudo systemctl daemon-reload"
Write-Host "sudo systemctl start django_gunicorn.service"
Write-Host "sudo systemctl enable django_gunicorn.service"
Write-Host "sudo systemctl start nextjs.service"
Write-Host "sudo systemctl enable nextjs.service"
Write-Host "sudo systemctl start nginx"
Write-Host "sudo systemctl enable nginx"
Write-Host ""
Write-Host "# 8. Configure firewall"
Write-Host "sudo firewall-cmd --permanent --add-service=http"
Write-Host "sudo firewall-cmd --permanent --add-service=https"
Write-Host "sudo firewall-cmd --reload"
Write-Host ""
Write-Host "# 9. Verify services are running"
Write-Host "sudo systemctl status django_gunicorn.service"
Write-Host "sudo systemctl status nextjs.service"
Write-Host "sudo systemctl status nginx"
Write-Host ""
Write-Host "Deployment preparation complete! Follow the instructions above on your RHEL server." 