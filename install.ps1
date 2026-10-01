# Copies the sunlitweed add-on into a Society: Sunlit Cobblemon instance (or server).
# Usage: .\install.ps1 [-Instance "path\to\instance"]
param(
    [string]$Instance = "$env:USERPROFILE\curseforge\minecraft\Instances\Society Sunlit Cobblemon"
)

$target = Join-Path $Instance "kubejs"
if (-not (Test-Path $target)) {
    Write-Error "No kubejs folder found at '$target'. Pass -Instance with the instance or server folder."
    exit 1
}

Copy-Item -Path (Join-Path $PSScriptRoot "kubejs\*") -Destination $target -Recurse -Force
Write-Host "Installed sunlitweed into $target. Restart the game (new blocks/items need a full restart)."
