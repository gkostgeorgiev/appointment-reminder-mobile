param(
  [switch]$CleanCache,
  [switch]$AutoReload
)

$ErrorActionPreference = "Stop"

function Get-ConnectedDeviceId {
  $lines = & adb devices
  foreach ($line in $lines) {
    if ($line -match "^([\w\-\.:]+)\s+device$") {
      return $Matches[1]
    }
  }

  return $null
}

function Wait-ForDevice {
  param(
    [int]$TimeoutSeconds = 120
  )

  $start = Get-Date
  while (((Get-Date) - $start).TotalSeconds -lt $TimeoutSeconds) {
    $deviceId = Get-ConnectedDeviceId
    if ($deviceId) {
      return $deviceId
    }

    Start-Sleep -Seconds 2
  }

  return $null
}

function Stop-ProcessOnPort {
  param(
    [int]$Port
  )

  $listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
    Select-Object -First 1

  if ($listener -and $listener.OwningProcess) {
    Write-Host "Stopping process $($listener.OwningProcess) on port $Port..."
    Stop-Process -Id $listener.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
  }
}

function Ensure-DevClientPrefs {
  param(
    [string]$DeviceId
  )

  $prefsXml = @"
<?xml version='1.0' encoding='utf-8' standalone='yes' ?>
<map>
    <boolean name="js_dev_mode_debug" value="true" />
  <boolean name="hot_module_replacement" value="true" />
  <boolean name="reload_on_js_change_LEGACY" value="false" />
    <boolean name="inspector_debug" value="false" />
    <string name="debug_http_host">127.0.0.1:8081</string>
    <boolean name="js_minify_debug" value="false" />
    <boolean name="animations_debug" value="false" />
</map>
"@

  $tmpFile = Join-Path $env:TEMP "appointment-reminder-dev-prefs.xml"
  Set-Content -Path $tmpFile -Value $prefsXml -NoNewline

  & adb -s $DeviceId push $tmpFile /data/local/tmp/appointment-reminder-dev-prefs.xml | Out-Null
  & adb -s $DeviceId shell run-as com.anonymous.appointmentremindermobile cp /data/local/tmp/appointment-reminder-dev-prefs.xml shared_prefs/com.anonymous.appointmentremindermobile_preferences.xml | Out-Null
}

if (-not (Get-Command adb -ErrorAction SilentlyContinue)) {
  Write-Error "adb was not found in PATH. Install Android platform-tools and restart your terminal."
}

$deviceId = Get-ConnectedDeviceId

if (-not $deviceId) {
  if (Get-Command emulator -ErrorAction SilentlyContinue) {
    $avds = & emulator -list-avds
    if ($avds -and $avds.Count -gt 0) {
      Write-Host "No device detected. Starting emulator '$($avds[0])'..."
      Start-Process emulator -ArgumentList "-avd", $avds[0] | Out-Null
      $deviceId = Wait-ForDevice -TimeoutSeconds 180
    }
  }
}

if (-not $deviceId) {
  Write-Error "No Android emulator/device connected. Start one in Android Studio Device Manager, then rerun this command."
}

Write-Host "Using device: $deviceId"

# Keep Metro on a fixed port so the dev-client URL always points to the active bundler.
Stop-ProcessOnPort -Port 8081

# Keep only the dev client active to avoid stale reload behavior from Expo Go sessions.
& adb -s $deviceId shell am force-stop host.exp.exponent | Out-Null
& adb -s $deviceId reverse tcp:8081 tcp:8081 | Out-Null
Ensure-DevClientPrefs -DeviceId $deviceId

$openAppJob = Start-Job -ScriptBlock {
  param($id)
  Start-Sleep -Seconds 5

  # Always open via dev-client URL so the app binds to Metro instead of a stale embedded bundle.
  & adb -s $id shell am start -a android.intent.action.VIEW -d "appointmentremindermobile://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081" | Out-Null
} -ArgumentList $deviceId

$expoArgs = @("expo", "start", "--dev-client", "--host", "localhost", "--port", "8081")
if ($CleanCache) {
  $expoArgs += "-c"
}

# Improve reliability of file change detection on Windows.
$env:CHOKIDAR_USEPOLLING = "1"
$env:CHOKIDAR_INTERVAL = "250"

$reloadWatcher = $null
$eventSubs = @()

if ($AutoReload) {
  $watchPath = Join-Path $PSScriptRoot "..\src"
  $reloadWatcher = New-Object System.IO.FileSystemWatcher
  $reloadWatcher.Path = (Resolve-Path $watchPath).Path
  $reloadWatcher.IncludeSubdirectories = $true
  $reloadWatcher.NotifyFilter = [System.IO.NotifyFilters]'FileName, LastWrite, DirectoryName'
  $reloadWatcher.Filter = "*.*"
  $reloadWatcher.EnableRaisingEvents = $true

  $reloadAction = {
    param($sender, $eventArgs)
    $path = $eventArgs.FullPath
    if ($path -match "\\node_modules\\|\\.git\\|\\android\\build\\|\\.expo\\") {
      return
    }

    Start-Sleep -Milliseconds 200
    try {
      Invoke-WebRequest -Uri "http://127.0.0.1:8081/reload" -UseBasicParsing | Out-Null
    } catch {
      # Metro may not be ready yet; ignore and continue watching.
    }
  }

  $eventSubs += Register-ObjectEvent -InputObject $reloadWatcher -EventName Changed -Action $reloadAction
  $eventSubs += Register-ObjectEvent -InputObject $reloadWatcher -EventName Created -Action $reloadAction
  $eventSubs += Register-ObjectEvent -InputObject $reloadWatcher -EventName Renamed -Action $reloadAction

  Write-Host "Auto reload on save is ON (full app reload)."
}

try {
  & npx @expoArgs
} finally {
  foreach ($sub in $eventSubs) {
    if ($sub) {
      Unregister-Event -SubscriptionId $sub.Id -ErrorAction SilentlyContinue
      Remove-Job -Id $sub.Id -Force -ErrorAction SilentlyContinue | Out-Null
    }
  }

  if ($reloadWatcher) {
    $reloadWatcher.EnableRaisingEvents = $false
    $reloadWatcher.Dispose()
  }

  Remove-Job -Id $openAppJob.Id -Force -ErrorAction SilentlyContinue | Out-Null
}
