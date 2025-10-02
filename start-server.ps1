param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('start','stop','status')]
    [string]$Action = 'start'
)

$port = 5500
$serverPath = Split-Path -Parent $MyInvocation.MyCommand.Definition

function Start-Server {
    Write-Output "Starting server on port $port..."
    $existing = Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq 'python' }
    if ($existing) {
        Write-Output "Python process already running.\nUse 'status' to inspect or 'stop' to stop it.";
        return
    }

    Start-Process -FilePath python -ArgumentList "-m","http.server","$port" -WorkingDirectory $serverPath -WindowStyle Hidden
    Start-Sleep -Seconds 1
    Write-Output "Server started. Visit http://localhost:$port"
}

function Stop-Server {
    Write-Output "Stopping server..."
    $proc = Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq 'python' }
    if ($proc) {
        $proc | Stop-Process -Force
        Write-Output "Server stopped."
    } else {
        Write-Output "No python server process found."
    }
}

function Status-Server {
    $proc = Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq 'python' }
    if ($proc) {
        Write-Output "Python server running (PID: $($proc.Id))."
    } else {
        Write-Output "No python server running."
    }
}

switch ($Action) {
    'start' { Start-Server }
    'stop'  { Stop-Server }
    'status' { Status-Server }
}
