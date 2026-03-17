$ErrorActionPreference = "Stop"

Write-Host "Stopping stale Node/Metro processes..."
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

if (-not (Get-Command adb -ErrorAction SilentlyContinue)) {
  Write-Error "adb was not found in PATH. Install Android platform-tools first."
}

Write-Host "Uninstalling Android app and Expo Go to remove stale state..."
& adb uninstall com.anonymous.appointmentremindermobile | Out-Null
& adb uninstall host.exp.exponent | Out-Null

Write-Host "Reinstalling npm dependencies..."
& npm install

Write-Host "Cleaning Android build outputs..."
Push-Location (Join-Path $PSScriptRoot "..\android")
try {
  & .\gradlew.bat clean
} finally {
  Pop-Location
}

Write-Host "Installing fresh Android debug app..."
& npm run android

Write-Host "Starting stable dev session with auto reload..."
& npm run android:dev:clean
