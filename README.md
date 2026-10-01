# sunlitweed

A KubeJS add-on for the **Society: Sunlit Cobblemon** modpack (Forge 1.20.1) that adds a weed crop and a full processing chain. It reuses the pack's own crop systems (the same ones as tubabacco), so the plant grows daily on watered farmland, follows the seasons, gets quality stars and fertilizer bonuses, and sells in the shipping bin.

## Production chain

| Step | How | Result |
|---|---|---|
| Seeds | 3% drop from grass; mature plants return 1–2 | `weed_seed` |
| Grow | Plant on farmland; grows in spring, summer and autumn | `weed` crop |
| Harvest | Break a mature plant | 1–2 `weed_stalk` |
| Dry | Farm & Charm drying rack | `dried_weed_stalk` |
| Trim | Cutting board + knife (3 buds), or crafting grid + knife (2 buds) | `weed_bud` |
| Grind | Create millstone, Create crushing wheels, or Farm & Charm mincer | 2 `ground_weed` |
| Blunt wrap | Dried tubabacco leaf → Create press or cutting board (2), or crafting + knife (1) | `blunt_wrap` |
| Joint | Ground weed + paper; or ground weed + dried tubabacco + paper for 2 | `joint` |
| Blunt | 2 ground weed + blunt wrap | `blunt` |

Right-click to smoke:
- **Joint:** Regeneration I (20s), Slowness (15s), Nausea (5s).
- **Blunt:** Regeneration II (30s), Slowness (25s), Nausea (8s), Hunger (20s).

## Install

Run in PowerShell:

```powershell
.\install.ps1
# or point it at another instance / server folder
.\install.ps1 -Instance "D:\servers\sunlit-cobblemon"
```

This copies `kubejs/` into the instance's `kubejs/` folder. Restart the game afterwards, because new items and blocks only register on startup. For multiplayer, install it on the server as well as on every client.

Pack updates can overwrite `kubejs/`, so re-run the installer after updating the pack.

## Layout

```
kubejs/
  startup_scripts/sunlitweed/   item + crop registration, crop list hook, sell prices
  server_scripts/sunlitweed/    recipes, season/quality tags, grass seed drop, smoking
  client_scripts/sunlitweed/    tooltips
  assets/sunlitweed/            lang, crop stage models, textures
  data/sunlitweed/              crop loot table
tools/gen_weed_textures.py      regenerates the placeholder textures
```

## Textures

The textures are 16×16 placeholders drawn from ASCII grids in `tools/gen_weed_textures.py` (Python standard library only). To regenerate them:

```
python tools/gen_weed_textures.py kubejs/assets/sunlitweed/textures
```

Or replace the PNGs in `kubejs/assets/sunlitweed/textures/` with your own.

## Requires

These are all included in Society: Sunlit Cobblemon:
- KubeJS 6 with LootJS
- Create 6
- Farmer's Delight
- Let's Do Farm & Charm
- Dew Drop Farmland Growth
- Serene Seasons
- The pack's `society:` scripts (`global.surviveCheck`, `global.cropList`, `global.trades`, `society:dried_tubabacco_leaf`)
