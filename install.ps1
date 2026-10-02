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

# Clear previous sunlitweed files first so ones deleted from the project don't linger
# (the Shady Trader's shop and skin live outside the sunlitweed folders)
foreach ($dir in "startup_scripts\sunlitweed", "server_scripts\sunlitweed", "client_scripts\sunlitweed", "assets\sunlitweed", "data\sunlitweed",
                 "data\society_trading\shops\sunlitweed_shady_trader.json",
                 "assets\minecraft\optifine\random\entity\wandering_trader.properties",
                 "assets\minecraft\optifine\random\entity\wandering_trader2.png") {
    $old = Join-Path $target $dir
    if (Test-Path $old) { Remove-Item -Recurse -Force $old }
}

Copy-Item -Path (Join-Path $PSScriptRoot "kubejs\*") -Destination $target -Recurse -Force
Write-Host "Installed sunlitweed into $target. Restart the game (new blocks/items need a full restart)."
