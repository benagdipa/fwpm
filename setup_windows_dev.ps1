# Windows Development Environment Setup Script

Write-Host "Setting up FWPM development environment on Windows..." -ForegroundColor Cyan

# Switch to development environment
Write-Host "Switching to development environment..." -ForegroundColor Cyan
.\switch_env.ps1 -Environment development

# Create logs directory if it doesn't exist
if (-not (Test-Path .\logs)) {
    Write-Host "Creating logs directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path .\logs -Force | Out-Null
}

# Create Python virtual environment if it doesn't exist
if (-not (Test-Path .\venv)) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to create Python virtual environment. Make sure Python is installed." -ForegroundColor Red
        exit 1
    }
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

# Install requirements
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install Python dependencies." -ForegroundColor Red
    exit 1
}

# Create staticfiles directory if it doesn't exist
if (-not (Test-Path .\fwpm_backend\staticfiles)) {
    Write-Host "Creating staticfiles directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path .\fwpm_backend\staticfiles -Force | Out-Null
}

# Create media directory if it doesn't exist
if (-not (Test-Path .\fwpm_backend\media)) {
    Write-Host "Creating media directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path .\fwpm_backend\media -Force | Out-Null
}

# Install frontend dependencies
Write-Host "Installing Next.js dependencies..." -ForegroundColor Yellow
Set-Location -Path .\fwpm_frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install Next.js dependencies. Make sure Node.js is installed." -ForegroundColor Red
    Set-Location -Path ..
    exit 1
}
Set-Location -Path ..

# Update Nginx dev config with absolute paths
$projectPath = Get-Location
$nginxDevConfig = "nginx_config\fwpm_app_dev.conf"

if (Test-Path $nginxDevConfig) {
    Write-Host "Updating Nginx development configuration with absolute paths..." -ForegroundColor Yellow
    $content = Get-Content $nginxDevConfig -Raw
    $content = $content -replace "/path/to/your/project/fwpm_backend/staticfiles/", ($projectPath.Path -replace "\\", "/") + "/fwpm_backend/staticfiles/"
    $content = $content -replace "/path/to/your/project/fwpm_backend/media/", ($projectPath.Path -replace "\\", "/") + "/fwpm_backend/media/"
    Set-Content -Path $nginxDevConfig -Value $content
}

Write-Host "`nSetup completed! Next steps:" -ForegroundColor Green
Write-Host "1. Make sure PostgreSQL is running and create the database:" -ForegroundColor Magenta
Write-Host "   - Database: $env:DB_DATABASE"
Write-Host "   - Username: $env:DB_USERNAME"
Write-Host "   - Password: $env:DB_PASSWORD"
Write-Host "   - Host: $env:DB_HOST"
Write-Host "   - Port: $env:DB_PORT"
Write-Host "2. Run migrations: python manage.py migrate" -ForegroundColor Magenta
Write-Host "3. Create a superuser: python manage.py createsuperuser" -ForegroundColor Magenta
Write-Host "4. Start Django development server: python manage.py runserver" -ForegroundColor Magenta
Write-Host "5. Start Next.js development server: cd fwpm_frontend && npm run dev" -ForegroundColor Magenta
Write-Host "`nTo run both servers simultaneously, open two PowerShell windows." -ForegroundColor Yellow 