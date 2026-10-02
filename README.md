# sunlitweed

A KubeJS add-on for the **Society: Sunlit Cobblemon** modpack (Forge 1.20.1) that adds a weed crop and a full processing chain. It reuses the pack's own crop systems (the same ones as tubabacco), so the plant grows daily on watered farmland, follows the seasons, gets quality stars and fertilizer bonuses, and sells in the shipping bin.

## Production chain

| Step | How | Result |
|---|---|---|
| Seeds | 3% drop from grass; mature plants return 1–2 | `weed_seed` |
| Grow | Plant on farmland; grows in spring, summer and autumn | `weed` crop |
| Harvest | Break a mature plant | 1–2 `weed_stalk` |
| Dry | The pack's **Dehydrator**: 8 stalks overnight, keeps quality. Or a Farm & Charm drying rack, which loses quality | `dried_weed_stalk` |
| Trim | Cutting board + knife (3 buds), or crafting grid + knife (2 buds) | `weed_bud` |
| Grind | Create millstone, Create crushing wheels (both keep quality), or Farm & Charm mincer (loses it) | 2 `ground_weed` |
| Blunt wrap | Dried tubabacco leaf → Create press or cutting board (2), or crafting + knife (1) | `blunt_wrap` |
| Joint | Ground weed + paper; or ground weed + dried tubabacco + paper for 2 | `joint` |
| Blunt | 2 ground weed + blunt wrap | `blunt` |

## Quality

Quality stars from the harvest carry through the whole chain: Dehydrator → cutting board or knife → millstone or crushing wheels → rolling. The drying rack and the mincer drop them. Starred joints and blunts sell for more in the shipping bin, and their effects last longer: ×1.25, ×1.5 or ×2 for 1, 2 or 3 stars.

## Dehydrator

Drying uses the pack's own **Dehydrator**. Load it with 8 weed stalks, golden teachers or liberty caps, and the next morning you collect all 8 dried. The batch takes the lowest quality of what was loaded. A cordycep-upgraded Dehydrator doubles mushroom batches, as it does for the pack's mushrooms, and the artisan hopper and Golden Clock work too.

The Dehydrator normally drops quality. `server_scripts/sunlitweed/dehydratorQuality.js` turns quality tracking on the first time you load one of these items into it by hand. That Dehydrator then keeps quality for everything, including the pack's fruit and mushrooms. A Dehydrator that has only ever been loaded by an artisan hopper won't keep quality until someone loads it by hand once. The recipes are in `startup_scripts/sunlitweed/weedDehydrator.js`.

## Smoking

Hold right-click to smoke. The item is raised to your mouth for a moment, like tooting a goat horn, then one is used up. Hold time and effects are set in `startup_scripts/sunlitweed/weedSmoking.js`.
- **Joint:** 1.5s. Regeneration I (20s), Slowness (15s), Nausea (5s).
- **Blunt:** 2s. Regeneration II (30s), Slowness (25s), Nausea (8s), Hunger (20s).

## Shady Trader

A rasta-coloured wandering trader who turns up the way the vanilla wanderer does. Once a Minecraft day there's a chance (25%, rising to 50% then 75% after each miss) that he appears within 48 blocks of a random overworld player. You get a "You smell something funky nearby..." hint, only one is around at a time, and he leaves after 2 days. He respects the `doTraderSpawning` gamerule. Timings are constants at the top of `server_scripts/sunlitweed/shadyTrader.js`.

| Item | Price |
|---|---|
| 4 weed seeds | 1 cog |
| Joint | 4 cogs |
| Blunt | 1 crown |
| 2 liberty caps | 3 cogs |
| 2 golden teachers | 5 cogs |
| Liberty Cap Log | 2 crowns |
| Golden Teacher Log | 3 crowns |

Each trade is limited to 4. The shop is `data/society_trading/shops/sunlitweed_shady_trader.json`. Under the hood he's a normal wandering trader named "Shady Trader" with the tag `sunlitweed_shady_trader`. Entity Texture Features gives him the rasta skin by name. To summon one for testing:

```
/summon minecraft:wandering_trader ~ ~ ~ {CustomName:'"Shady Trader"',Tags:["sunlitweed_shady_trader"],Offers:{Recipes:[]}}
```

## Magic mushrooms

Fresh **golden teachers** and **liberty caps** can't be eaten. Dry them first:
- **Dehydrator:** 8 at a time overnight, keeps quality (same as weed stalks).
- **Farm & Charm drying rack:** loses quality.

Eat a dried mushroom (you can eat them even when full), or brew mushroom tea:
1. **Mushroom Tea Blend:** craft 2 dried mushrooms (golden teachers and liberty caps in any mix) with 4 tea leaves. Any Herbalbrews leaf works: green tea leaf, or dried green, black or oolong tea.
2. **Herbalbrews Tea Kettle:** brew the blend with water and heat to get 4 cups of Mushroom Tea. A separate blend is needed because the kettle only takes 5 ingredients, one item each.

| | Trip | Effects |
|---|---|---|
| Dried liberty cap | 60s | Nausea, night-vision flickers, the screen cycling through Minecraft's built-in shaders (wobble, deconverge, phosphor, colour shifts, NTSC and more), stray sparkles and odd sounds |
| Dried golden teacher | 120s | The same with more sparkles and sounds, plus short inverted or flipped flashes |
| Mushroom Tea | 120s | Same as a golden teacher |

Quality stars stretch the trip of dried mushrooms like they do for smoking. Tea from the kettle has no quality. Having another mid-trip extends it. Durations are in `startup_scripts/sunlitweed/weedMushrooms.js` and the visuals are in `client_scripts/sunlitweed/weedTrip.js`. The screen shaders may not show while an Oculus shaderpack is on, but everything else still works.

### Growing them

Place a **Golden Teacher Log** or **Liberty Cap Log** within 8 blocks of the pack's **Mushroom Log**. They're "dominant" logs, so the Mushroom Log grows 2 golden teachers or 3 liberty caps instead of its usual mushrooms. More logs nearby means better quality, as with any Mushroom Log. Craft an inoculated log from any log + 2 of the mushroom, or buy one from the Shady Trader.

## Install

Run in PowerShell:

```powershell
.\install.ps1
# if Windows says running scripts is disabled:
powershell -ExecutionPolicy Bypass -File .\install.ps1
# or point it at another instance / server folder
.\install.ps1 -Instance "D:\servers\sunlit-cobblemon"
```

This copies `kubejs/` into the instance's `kubejs/` folder. Restart the game afterwards, because new items and blocks only register on startup. For multiplayer, install it on the server as well as on every client.

Pack updates can overwrite `kubejs/`, so re-run the installer after updating the pack.

## Layout

```
kubejs/
  startup_scripts/sunlitweed/   items, crop, Dehydrator recipes, smoking, mushrooms and logs, crop list hook, sell prices
  server_scripts/sunlitweed/    recipes, season/quality tags, grass seed drop, Shady Trader spawning, Dehydrator quality hook
  client_scripts/sunlitweed/    tooltips, trip visuals
  assets/sunlitweed/            lang, crop, machine and log models, textures
  assets/minecraft/optifine/    Shady Trader skin (Entity Texture Features)
  data/sunlitweed/              crop loot table
  data/society_trading/shops/   Shady Trader shop
tools/gen_weed_textures.py      regenerates the placeholder textures and the Shady Trader skin
```

## Textures

The textures are 16×16 placeholders drawn from ASCII grids in `tools/gen_weed_textures.py` (Python standard library only). To regenerate them:

```
python tools/gen_weed_textures.py kubejs/assets/sunlitweed/textures
```

The Shady Trader skin is the vanilla wandering trader skin recoloured, read from the Minecraft 1.20.1 jar in the CurseForge install. If yours is somewhere else, add `--jar path	o.20.1.jar`.

Or replace the PNGs in `kubejs/assets/sunlitweed/textures/` with your own.

## Requires

These are all included in Society: Sunlit Cobblemon:
- KubeJS 6 with LootJS
- Create 6
- Farmer's Delight
- Let's Do Farm & Charm
- Dew Drop Farmland Growth
- Serene Seasons
- Quality Food
- Society Trading (shops) and Entity Texture Features (Shady Trader skin)
- The pack's `society:` scripts (`global.surviveCheck`, `global.cropList`, `global.trades`, `global.mushroomLogRecipes`, `global.dehydratorRecipes`, `society:mushroom_log`, `society:dehydrator`, `society:dried_tubabacco_leaf`)
