#!/bin/bash
# NGINX Configuration and Service Setup for FWPM Application on RHEL
# For fwpm.nwas.nbnco.net.au at /var/www/fwpm

set -e

echo "Setting up NGINX and services for FWPM Application"
echo "=================================================="

# 1. Install required packages
echo "Installing required packages..."
sudo dnf update -y
sudo dnf install nginx python3 python3-pip nodejs npm -y

# 2. Check and create www-data user if it doesn't exist (common on Debian/Ubuntu but not on RHEL)
echo "Checking for www-data user..."
if ! id "www-data" &>/dev/null; then
    echo "Creating www-data user and group..."
    sudo groupadd --system www-data
    sudo useradd --system --gid www-data --shell /sbin/nologin --comment "Web Server" www-data
fi

# 3. Create required directories
echo "Creating directories..."
sudo mkdir -p /var/www/fwpm/fwpm_backend/staticfiles
sudo mkdir -p /var/www/fwpm/fwpm_backend/media
sudo mkdir -p /var/log/gunicorn

# 4. Set permissions for log directory
echo "Setting log directory permissions..."
sudo chown -R www-data:www-data /var/log/gunicorn
sudo chmod -R 755 /var/log/gunicorn

# 5. Copy NGINX configuration files
echo "Configuring NGINX..."
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo cp fwpm_app.conf /etc/nginx/conf.d/fwpm_app.conf

# 6. Set up service files
echo "Setting up systemd service files..."
sudo cp django_gunicorn.service /etc/systemd/system/
sudo cp nextjs.service /etc/systemd/system/

# 7. Set permissions for application directories
echo "Setting permissions..."
sudo chown -R www-data:www-data /var/www/fwpm/fwpm_backend/staticfiles
sudo chown -R www-data:www-data /var/www/fwpm/fwpm_backend/media
sudo chmod -R 755 /var/www/fwpm/fwpm_backend/staticfiles
sudo chmod -R 755 /var/www/fwpm/fwpm_backend/media

# 8. Apply SELinux context (important on RHEL)
echo "Applying SELinux context..."
sudo chcon -R -t httpd_sys_content_t /var/www/fwpm/fwpm_backend/staticfiles
sudo chcon -R -t httpd_sys_content_t /var/www/fwpm/fwpm_backend/media
sudo chcon -R -t httpd_sys_rw_content_t /var/www/fwpm/fwpm_backend/media
sudo chcon -R -t httpd_log_t /var/log/gunicorn

# 9. Test NGINX configuration
echo "Testing NGINX configuration..."
sudo nginx -t

# 10. Start and enable services
echo "Starting and enabling services..."
sudo systemctl daemon-reload
sudo systemctl start django_gunicorn.service
sudo systemctl enable django_gunicorn.service
sudo systemctl start nextjs.service
sudo systemctl enable nextjs.service
sudo systemctl start nginx
sudo systemctl enable nginx

# 11. Configure firewall
echo "Configuring firewall..."
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# 12. Display service status
echo "Service status:"
sudo systemctl status django_gunicorn.service --no-pager
sudo systemctl status nextjs.service --no-pager
sudo systemctl status nginx --no-pager

echo "=================================================="
echo "NGINX configuration and service setup complete!"
echo "Your application should now be accessible at: http://fwpm.nwas.nbnco.net.au"
echo "==================================================" 