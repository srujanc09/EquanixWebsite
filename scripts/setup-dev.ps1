# Copies example env into backend/.env (if missing) and opens it for editing
Param()

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$envPath = Join-Path $repoRoot 'backend\.env'
$examplePath = Join-Path $repoRoot 'backend\.env.example'

if (-Not (Test-Path $examplePath)) {
    Write-Error "Missing $examplePath"
    exit 1
}

if (-Not (Test-Path $envPath)) {
    Copy-Item -Path $examplePath -Destination $envPath
    Write-Host "Created backend/.env from example. Please edit it and fill in secrets."
    notepad $envPath
} else {
    Write-Host "backend/.env already exists at $envPath — opening for edit"
    notepad $envPath
}
