# restart-keep-session.ps1
# Restarts the WhatsApp service WITHOUT clearing the session

Write-Host "Stopping WhatsApp service..." -ForegroundColor Yellow

# Kill any running Node processes for this service
Get-Process -Name "node" -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.MainWindowTitle -like "*whatsapp*" -or $_.CommandLine -like "*whatsapp-service*") {
        Write-Host "Killing process $($_.Id)..."
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
}

# Also try taskkill for any node process on port 3001
$procId = (Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue).OwningProcess
if ($procId) {
    Write-Host "Killing process on port 3001: $procId"
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "Session data preserved!" -ForegroundColor Green
Write-Host ""

Write-Host "Starting WhatsApp service..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the service" -ForegroundColor DarkGray
Write-Host ""

# Change to script directory and start
Set-Location $PSScriptRoot
npm start
