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
# (the Shady Trader's shop and skin, and The Plug's NPC files, live outside the sunlitweed folders)
foreach ($dir in "startup_scripts\sunlitweed", "server_scripts\sunlitweed", "client_scripts\sunlitweed", "assets\sunlitweed", "data\sunlitweed",
                 "data\society_trading\shops\sunlitweed_shady_trader.json",
                 "assets\minecraft\optifine\random\entity\wandering_trader.properties",
                 "assets\minecraft\optifine\random\entity\wandering_trader2.png",
                 "data\society\villagers\plug.json",
                 "data\society_trading\shops\plug.json",
                 "data\dialog\dialogs\plug_*.json",
                 "assets\dialog\textures\portraits\plug.png",
                 "assets\dialog\textures\portraits\*\plug.png",
                 "assets\society\textures\item\villager_icons\plug.png",
                 "assets\society\models\item\villager\plug.json") {
    $old = Join-Path $target $dir
    if (Test-Path $old) { Remove-Item -Recurse -Force $old }
}

Copy-Item -Path (Join-Path $PSScriptRoot "kubejs\*") -Destination $target -Recurse -Force
# The Plug's Easy NPC preset and skin go in the instance's config folder
Copy-Item -Path (Join-Path $PSScriptRoot "config\*") -Destination (Join-Path $Instance "config") -Recurse -Force
Write-Host "Installed sunlitweed into $target. Restart the game (new blocks/items need a full restart)."
