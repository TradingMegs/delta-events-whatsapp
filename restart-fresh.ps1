# Clean WhatsApp Session and Restart
# This script clears the old session and starts fresh

Write-Host "Stopping WhatsApp service..." -ForegroundColor Yellow

# Kill any running node processes on port 3001
$processes = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($procId in $processes) {
    Write-Host "Killing process $procId..." -ForegroundColor Yellow
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 2

Write-Host "Clearing old session..." -ForegroundColor Yellow

# Remove tokens folder
$tokensPath = Join-Path $PSScriptRoot "tokens"
if (Test-Path $tokensPath) {
    Remove-Item -Path $tokensPath -Recurse -Force
    Write-Host "✓ Session cleared" -ForegroundColor Green
}
else {
    Write-Host "✓ No existing session found" -ForegroundColor Green
}

Write-Host "`nStarting WhatsApp service..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the service`n" -ForegroundColor Cyan

# Start the service
Set-Location $PSScriptRoot
npm start
