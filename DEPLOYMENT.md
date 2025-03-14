# Deployment Guide

This guide provides instructions for deploying the FWPM application in both development and production environments.

## Environment Configuration

The application supports two different environments:
- **Development**: Windows-based local development and testing
- **Production**: RHEL (Red Hat Enterprise Linux) with NGINX server

## Switching Between Environments

Use the `switch_env.ps1` PowerShell script to switch between environments on your Windows development machine:

```powershell
# Switch to development environment
.\switch_env.ps1 -Environment development

# Switch to production environment (for deployment preparation)
.\switch_env.ps1 -Environment production
```

This script will:
1. Set the appropriate environment variables
2. Copy the correct .env file for the environment
3. Display instructions for next steps

## Windows Development Environment Setup

### Prerequisites
- Windows 10 or 11
- Python 3.9+
- PostgreSQL 13+ for Windows
- Node.js 14+
- npm 6+

### Automated Setup
Run the provided setup script:
```powershell
.\setup_windows_dev.ps1
```

### Manual Setup Steps

1. **Switch to development environment**:
   ```powershell
   .\switch_env.ps1 -Environment development
   ```

2. **Set up Python virtual environment**:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

3. **Set up PostgreSQL database** (Using pgAdmin or command line):
   ```powershell
   # Using psql command line
   psql -U postgres -c "CREATE USER fwpmuser WITH PASSWORD 'fwpmpassword';"
   psql -U postgres -c "CREATE DATABASE fwpmdb OWNER fwpmuser;"
   ```

4. **Initialize Django backend**:
   ```powershell
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py collectstatic --noinput
   ```

5. **Start Django development server**:
   ```powershell
   python manage.py runserver
   ```

6. **Install Next.js dependencies**:
   ```powershell
   cd fwpm_frontend
   npm install
   ```

7. **Start Next.js development server**:
   ```powershell
   npm run dev
   ```

8. **Access the application**:
   - Frontend: http://localhost:3000
   - API: http://localhost:8000/api/
   - Admin: http://localhost:8000/admin/

## RHEL Production Environment Setup

### Prerequisites
- RHEL/CentOS or similar Linux distribution
- Nginx
- PostgreSQL 13+ (AWS RDS in production)
- Python 3.9+
- Node.js 14+

### Automated Deployment

Use the deployment script from your Windows development machine:
```powershell
.\nginx_config\deploy_to_rhel.ps1 -ServerIP "your.server.ip" -Username "ssh_username" -SshKeyPath "C:\path\to\your\ssh\key.pem"
```

This script will:
1. Build the Next.js application
2. Package the application
3. Transfer it to the RHEL server
4. Set up and configure all services
5. Restart all services

### Manual Deployment Steps

1. **Prepare the server**:
   ```bash
   # Create application directory
   sudo mkdir -p /var/www/fwpm
   sudo chown -R www-data:www-data /var/www/fwpm
   ```

2. **Deploy application files** (from Windows development environment):
   ```powershell
   # Prepare application for deployment
   .\switch_env.ps1 -Environment production
   
   # Build Next.js application
   cd fwpm_frontend
   npm run build
   cd ..
   
   # Archive application (exclude unnecessary files)
   tar -czf fwpm_deploy.tar.gz --exclude="./venv/*" --exclude="./node_modules/*" --exclude="./.git/*" ./
   
   # Transfer to server using SCP
   scp -i "path\to\your\key.pem" fwpm_deploy.tar.gz username@server_ip:/tmp/
   ```

3. **On the RHEL server, extract and configure**:
   ```bash
   # Extract files
   cd /var/www/fwpm
   sudo tar -xzf /tmp/fwpm_deploy.tar.gz -C /var/www/fwpm
   
   # Set environment
   export DJANGO_ENV=production
   export NODE_ENV=production
   
   # Set up Python virtual environment
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt gunicorn
   ```

4. **Configure SSL certificates** (required for HTTPS):
   ```bash
   # Install SSL certificates
   sudo mkdir -p /etc/ssl/certs /etc/ssl/private
   # Copy your SSL certificates to these locations
   sudo cp your-cert.crt /etc/ssl/certs/fwpm.nwas.nbnco.net.au.crt
   sudo cp your-key.key /etc/ssl/private/fwpm.nwas.nbnco.net.au.key
   ```

5. **Configure Nginx**:
   ```bash
   sudo cp nginx_config/fwpm_app.conf /etc/nginx/conf.d/
   sudo nginx -t  # Test configuration
   sudo systemctl restart nginx
   ```

6. **Set up system services**:
   ```bash
   sudo cp gunicorn.service /etc/systemd/system/
   sudo cp nginx_config/nextjs.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable gunicorn
   sudo systemctl enable nextjs
   ```

7. **Initialize Django backend**:
   ```bash
   cd /var/www/fwpm
   source venv/bin/activate
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py collectstatic --noinput
   ```

8. **Start services**:
   ```bash
   sudo systemctl start gunicorn
   sudo systemctl start nextjs
   ```

9. **Access the application**:
   - Frontend: https://fwpm.nwas.nbnco.net.au
   - API: https://fwpm.nwas.nbnco.net.au/api/
   - Admin: https://fwpm.nwas.nbnco.net.au/admin/

## Platform-Specific Notes

### Windows-Specific Notes
- Path separators are backslashes (`\`) in PowerShell commands
- Use PowerShell commands and scripts for local development
- Use PostgreSQL for Windows as your local database

### RHEL-Specific Notes
- Path separators are forward slashes (`/`) in bash commands
- Use systemd for service management
- NGINX is configured to handle both HTTP to HTTPS redirection
- The production database is hosted on AWS RDS

## Troubleshooting

### Windows Troubleshooting
- Check Python and Node.js installations: `python --version`, `node --version`
- Verify PostgreSQL service is running: `sc query postgresql-x64-13`
- Check for port conflicts: `netstat -ano | findstr :8000` or `netstat -ano | findstr :3000`

### RHEL Troubleshooting
- Check service status:
  ```bash
  sudo systemctl status gunicorn
  sudo systemctl status nextjs
  sudo systemctl status nginx
  ```
- View logs:
  ```bash
  sudo journalctl -u gunicorn
  sudo journalctl -u nextjs
  sudo tail -f /var/log/nginx/error.log
  ```
- Check file permissions: `ls -la /var/www/fwpm`

### Common issues:
1. **Permission problems**: Ensure proper user access on both platforms
2. **Port conflicts**: Check if ports 80, 443, 3000, and 8000 are available
3. **Database connectivity**: Verify PostgreSQL is running and credentials are correct
4. **Environment variables**: Confirm the environment variables are set correctly

## Database Backups

### Backing up Production Database (from Windows)

```powershell
# Install PostgreSQL client tools if not already installed
# Then run pg_dump over SSH
$env:PGPASSWORD="fw_tracker"
pg_dump -U fw_tracker -h rde-db-prod.cbcmnecdaqnb.ap-southeast-2.rds.amazonaws.com `
  -d FWPerfmngrDB > "fwpm_backup_$(Get-Date -Format 'yyyyMMdd').sql"
```

### Backing up Production Database (from RHEL)

```bash
# Set password temporarily or use .pgpass file
export PGPASSWORD=fw_tracker
pg_dump -U fw_tracker -h rde-db-prod.cbcmnecdaqnb.ap-southeast-2.rds.amazonaws.com \
  -d FWPerfmngrDB > fwpm_backup_$(date +%Y%m%d).sql
unset PGPASSWORD
```

### Restoring from a backup

```bash
# On RHEL
psql -U fw_tracker -h rde-db-prod.cbcmnecdaqnb.ap-southeast-2.rds.amazonaws.com \
  -d FWPerfmngrDB < fwpm_backup_20230301.sql

# On Windows
$env:PGPASSWORD="fw_tracker"
psql -U fw_tracker -h rde-db-prod.cbcmnecdaqnb.ap-southeast-2.rds.amazonaws.com `
  -d FWPerfmngrDB < fwpm_backup_20230301.sql
``` 