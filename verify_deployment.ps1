# Deployment Verification Script
# This script checks if the application is properly configured for production

Write-Host "FWPM Deployment Verification Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if required environment files exist
Write-Host "`nChecking environment files..." -ForegroundColor Cyan
$envFiles = @(".env.production", ".env.development", ".env")
foreach ($file in $envFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file does not exist" -ForegroundColor Red
    }
}

# Check if database is configured
Write-Host "`nChecking database configuration..." -ForegroundColor Cyan
$dbHost = $null
$dbPort = $null
$dbName = $null
$dbUser = $null

if (Test-Path ".env.production") {
    $envContent = Get-Content ".env.production" -Raw
    if ($envContent -match "DB_HOST=(.+)") { $dbHost = $matches[1] }
    if ($envContent -match "DB_PORT=(.+)") { $dbPort = $matches[1] }
    if ($envContent -match "DB_DATABASE=(.+)") { $dbName = $matches[1] }
    if ($envContent -match "DB_USERNAME=(.+)") { $dbUser = $matches[1] }
}

if ($dbHost -and $dbPort -and $dbName -and $dbUser) {
    Write-Host "✓ Database configuration found: $dbUser@$dbHost`:$dbPort/$dbName" -ForegroundColor Green
} else {
    Write-Host "✗ Database configuration incomplete" -ForegroundColor Red
}

# Check if Starburst credentials are configured
Write-Host "`nChecking Starburst configuration..." -ForegroundColor Cyan
$starburstHost = $null
$starburstUser = $null

if (Test-Path ".env.production") {
    $envContent = Get-Content ".env.production" -Raw
    if ($envContent -match "STARBURST_HOST=(.+)") { $starburstHost = $matches[1] }
    if ($envContent -match "STARBURST_USER=(.+)") { $starburstUser = $matches[1] }
}

if ($starburstHost -and $starburstUser) {
    Write-Host "✓ Starburst configuration found: $starburstUser@$starburstHost" -ForegroundColor Green
} else {
    Write-Host "✗ Starburst configuration incomplete" -ForegroundColor Red
}

# Check if Django is installed
Write-Host "`nChecking Django installation..." -ForegroundColor Cyan
try {
    $djangoCheck = python -c "import django; print(django.get_version())" 2>$null
    if ($djangoCheck) {
        Write-Host "✓ Django is installed (version $djangoCheck)" -ForegroundColor Green
    } else {
        Write-Host "✗ Django is not installed" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Error checking Django installation" -ForegroundColor Red
}

# Check if Node.js is installed
Write-Host "`nChecking Node.js installation..." -ForegroundColor Cyan
try {
    $nodeCheck = node -v 2>$null
    if ($nodeCheck) {
        Write-Host "✓ Node.js is installed (version $nodeCheck)" -ForegroundColor Green
    } else {
        Write-Host "✗ Node.js is not installed" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Error checking Node.js installation" -ForegroundColor Red
}

# Check if frontend is built
Write-Host "`nChecking frontend build..." -ForegroundColor Cyan
if (Test-Path "fwpm_frontend/.next") {
    Write-Host "✓ Frontend build exists" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend is not built" -ForegroundColor Red
}

# Check API connectivity
Write-Host "`nChecking API connectivity..." -ForegroundColor Cyan
$apiUrl = $null

if (Test-Path ".env.production") {
    $envContent = Get-Content ".env.production" -Raw
    if ($envContent -match "NEXT_PUBLIC_API_URL=(.+)") { $apiUrl = $matches[1] }
}

if ($apiUrl) {
    try {
        $response = Invoke-WebRequest -Uri "$($apiUrl)health-check/" -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ API is accessible at $apiUrl" -ForegroundColor Green
        } else {
            Write-Host "✗ API returned status code $($response.StatusCode)" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ Cannot connect to API at $apiUrl" -ForegroundColor Red
    }
} else {
    Write-Host "✗ API URL not configured" -ForegroundColor Red
}

# Summary
Write-Host "`nDeployment Verification Summary" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host "1. Ensure all environment variables are properly set"
Write-Host "2. Make sure database is accessible"
Write-Host "3. Verify Starburst credentials are correct"
Write-Host "4. Check that frontend is built with 'npm run build'"
Write-Host "5. Ensure Django migrations are applied with 'python manage.py migrate'"
Write-Host "6. Verify static files are collected with 'python manage.py collectstatic'"
Write-Host "7. Check that Gunicorn and Nginx services are running"
Write-Host "`nRun the following command to start the application in production mode:"
Write-Host "python manage.py runserver --settings=fwpm_backend.settings" -ForegroundColor Yellow 