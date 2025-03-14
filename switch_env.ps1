# Script to switch between development and production environments

param (
    [Parameter(Mandatory=$true)]
    [ValidateSet("development", "production")]
    [string]$Environment
)

Write-Host "Switching to $Environment environment..." -ForegroundColor Cyan

$envFile = ".env"
$envDevFile = ".env.development"
$envProdFile = ".env.production"

# Check if environment files exist
if (-not (Test-Path $envDevFile)) {
    Write-Host "Error: $envDevFile file not found." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $envProdFile)) {
    Write-Host "Error: $envProdFile file not found." -ForegroundColor Red
    exit 1
}

# Set the DJANGO_ENV environment variable
[Environment]::SetEnvironmentVariable("DJANGO_ENV", $Environment, "Process")

# Optionally, for current PowerShell session
$env:DJANGO_ENV = $Environment

# Set NODE_ENV for the frontend (for NextJS)
if ($Environment -eq "production") {
    [Environment]::SetEnvironmentVariable("NODE_ENV", "production", "Process")
    $env:NODE_ENV = "production"
} else {
    [Environment]::SetEnvironmentVariable("NODE_ENV", "development", "Process")
    $env:NODE_ENV = "development"
}

# Copy the appropriate .env file to .env
if ($Environment -eq "production") {
    Copy-Item -Path $envProdFile -Destination $envFile -Force
    Write-Host "Copied production environment settings to $envFile" -ForegroundColor Green
} else {
    Copy-Item -Path $envDevFile -Destination $envFile -Force
    Write-Host "Copied development environment settings to $envFile" -ForegroundColor Green
}

# Display current environment settings
Write-Host ""
Write-Host "Current Environment Variables:" -ForegroundColor Yellow
Write-Host "DJANGO_ENV = $env:DJANGO_ENV"
Write-Host "NODE_ENV = $env:NODE_ENV"
Write-Host ""

# Instructions for next steps
Write-Host "Next steps:" -ForegroundColor Magenta
if ($Environment -eq "development") {
    Write-Host "1. Start the Django development server: python manage.py runserver" 
    Write-Host "2. Start the Next.js development server: cd fwpm_frontend && npm run dev"
} else {
    Write-Host "1. Start Gunicorn: gunicorn fwpm_backend.wsgi:application"
    Write-Host "2. Build Next.js: cd fwpm_frontend && npm run build"
    Write-Host "3. Start Next.js: cd fwpm_frontend && npm start"
}

Write-Host ""
Write-Host "Environment switched successfully to $Environment mode!" -ForegroundColor Green 