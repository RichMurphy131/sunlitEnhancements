# sunlitweed

A KubeJS add-on for the **Society: Sunlit Cobblemon** modpack (Forge 1.20.1) that adds a weed crop, magic mushrooms, a coca crop and LSD, each with a full processing chain, plus a dealer NPC for your town. It reuses the pack's own crop systems (the same ones as tubabacco), so the plant grows daily on watered farmland, follows the seasons, gets quality stars and fertilizer bonuses, and sells in the shipping bin.

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
| 4 coca seeds | 2 cogs |
| 2 ergot | 2 cogs |
| Invitation for The Plug | 3 crowns (limit 1) |

Each trade is limited to 4 unless noted. The shop is `data/society_trading/shops/sunlitweed_shady_trader.json`. Under the hood he's a normal wandering trader named "Shady Trader" with the tag `sunlitweed_shady_trader`. Entity Texture Features gives him the rasta skin by name. To summon one for testing:

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

## Coca

| Step | How | Result |
|---|---|---|
| Seeds | Shady Trader or The Plug; mature plants return 1–2 | `coca_seed` |
| Grow | Plant on farmland; grows in summer and autumn | `coca` crop |
| Harvest | Break a mature plant | 2–3 `coca_leaf` |
| Slaked lime | Create limestone through crushing wheels (2, sometimes 3) or a millstone (1). This is the only source | `slaked_lime` |
| Paste | Basin + mechanical mixer (no heat): 4 coca leaves, 1 slaked lime, 250 mB water | `base_coca_paste` |
| Dry | Encased fan blowing through lava or fire (a blast furnace also works) | `refined_coca_powder` |
| Brick | Basin + mechanical press: 4 refined powder | `cocaine_brick` |
| Lines | Cutting board + knife (8), or crafting grid + knife (6) | `cocaine_line` |

Quality stars from the leaves carry through the mixer, fan, press and knife (Quality Food handles the Create machines). Bricks sell for a lot in the shipping bin.

Hold right-click on a line for a second to snort it: Speed II and Haste II for 5 minutes, ×1.25, ×1.5 or ×2 for 1, 2 or 3 stars. The catch is you can't sleep until the next morning (6am). Beds refuse you until then, even if you log out. Effects are in `startup_scripts/sunlitweed/weedSmoking.js` and the sleep ban is in `startup_scripts/sunlitweed/cocaSleep.js`. Recipes are in `server_scripts/sunlitweed/cocaRecipes.js`.

## LSD

Loaves and fishes: five loaves, two fishes, and twelve baskets left over. LSD comes from ergot, a fungus that grows on grain, so it starts as bread. Botania supplies the miracles, and Create handles the liquid-to-blotter end the way blotter is really made: perforated sheets are dosed with solution, then dried away from light and heat.

| Step | How | Result |
|---|---|---|
| Ergot | 4% extra drop from mature wheat, or a mana pool on an **alchemy catalyst** turns wheat into ergot (1,500 mana). The Shady Trader sells it too | `ergot` |
| Ergot loaf | Craft 3 wheat + 1 ergot | `ergot_loaf` |
| Multiply the loaves | Mana pool on a **conjuration catalyst**: 1 loaf becomes 2 (5,000 mana) | 2 `ergot_loaf` |
| Solution | Basin + mechanical mixer (no heat): 5 ergot loaves, 2 fish (any), 1,000 mB water | 500 mB `lsd_solution` |
| Blotter stock | Basin + mechanical press: 2 paper | `blank_blotter` |
| Perforate and dose | Sequenced assembly on a belt: a deployer holding a knife (it keeps the knife), then a spout with 100 mB of solution | `wet_blotter_sheet` |
| Dry | The **Dehydrator** (8 overnight) or a Farm & Charm drying rack. There's no fan or furnace route, because light and heat ruin it | `lsd_blotter_sheet` |
| Bless (optional) | Drop it in a mana pool (10,000 mana) | `mana_blotter_sheet` |
| Tabs | Mechanical saw or cutting board + knife (12), or crafting grid + knife (8). Works for either sheet | `acid_tab` / `mana_acid_tab` |

One mixer batch doses 5 sheets, which make 60 tabs. A simple line: mixer → fluid pipe → spout over a belt, with a deployer holding a knife just before the spout. Feed blank blotter onto the belt and collect wet sheets at the end.

Eat a tab (you can eat them even when full) for a trip like the mushrooms', only longer and stronger. Shaders change twice as fast, flashes come more often, and extra shaders join the cycle (creeper, spider, green, desaturate).
- **Acid Tab:** 4 minutes.
- **Mana Acid Tab:** 6 minutes, with Botania sounds out of nowhere and mana-blue sparkles.

Taking another mid-trip extends it. There's no quality for this chain. Recipes are in `server_scripts/sunlitweed/lsdRecipes.js`, trip lengths are in `startup_scripts/sunlitweed/weedMushrooms.js` and the visuals are in `client_scripts/sunlitweed/weedTrip.js`.

## The Plug

A town NPC like the Market or the Librarian. His name is Rico, and he sells coca seeds, slaked lime, weed seeds, magic mushrooms, lines and acid tabs. Buy his invitation from the Shady Trader, right-click it to get his villager home, and place the home where you want him to live.

He works like the other townsfolk: talk to him once a day for friendship, then talk again to open his shop, and crouch + right-click to give gifts. He loves cocaine bricks, refined powder, paste and blotter sheets, likes joints, blunts, acid tabs, dried mushrooms and coffee, and hates tubasmokes. At max friendship he gives you 8 cocaine bricks, and later a Cobblemon mystery gift.

| File | What |
|---|---|
| `server_scripts/sunlitweed/plugNpc.js` | Adds him to the pack's NPC tables (preset, dialog counts, max-friendship gift) |
| `startup_scripts/sunlitweed/plugGifts.js` | Gift tastes and mystery gift |
| `data/society_trading/shops/plug.json` | His shop |
| `data/society/villagers/plug.json` | Registers him with Society (invitation, villager item) |
| `data/dialog/dialogs/plug_*.json` | Dialog, generated by `tools/gen_plug_dialog.py` along with his lines in the lang file. Edit the lines there and re-run it |
| `config/easy_npc/` | His Easy NPC preset and skin, generated by `tools/gen_plug_npc.py` |

`gen_plug_npc.py` builds his preset, skin, portraits and icon from the pack's Market NPC (a white suit and shades), so it needs the pack installed. Pass `--instance path` if it isn't in the default CurseForge folder.

## Install

Run in PowerShell:

```powershell
.\install.ps1
# if Windows says running scripts is disabled:
powershell -ExecutionPolicy Bypass -File .\install.ps1
# or point it at another instance / server folder
.\install.ps1 -Instance "D:\servers\sunlit-cobblemon"
```

This copies `kubejs/` into the instance's `kubejs/` folder and `config/` into its `config/` folder. Restart the game afterwards, because new items and blocks only register on startup. For multiplayer, install it on the server as well as on every client.

Pack updates can overwrite `kubejs/`, so re-run the installer after updating the pack.

## Layout

```
kubejs/
  startup_scripts/sunlitweed/   items, LSD solution fluid, crops, Dehydrator recipes, smoking, mushrooms and logs, sleep ban, The Plug's gifts, crop list hook, sell prices
  server_scripts/sunlitweed/    recipes (incl. Botania mana pool), season/quality tags, grass seed and ergot drops, Shady Trader spawning, Dehydrator quality hook, The Plug's NPC hooks
  client_scripts/sunlitweed/    tooltips, trip visuals
  assets/sunlitweed/            lang, crop, machine and log models, textures
  assets/minecraft/optifine/    Shady Trader skin (Entity Texture Features)
  data/sunlitweed/              crop loot tables
  data/society_trading/shops/   Shady Trader and The Plug's shops
  data/society/villagers/       registers The Plug with Society
  data/dialog/dialogs/          The Plug's dialog
  assets/dialog/, assets/society/   The Plug's portraits and villager icon
config/easy_npc/                The Plug's Easy NPC preset and skin
tools/gen_weed_textures.py      regenerates the placeholder textures and the Shady Trader skin
tools/gen_plug_npc.py           regenerates The Plug's preset, skin, portraits and icon
tools/gen_plug_dialog.py        regenerates The Plug's dialog and its lang keys
```

## Textures

The textures are 16×16 placeholders drawn from ASCII grids in `tools/gen_weed_textures.py` (Python standard library only). To regenerate them:

```
python tools/gen_weed_textures.py kubejs/assets/sunlitweed/textures
```

The Shady Trader skin is the vanilla wandering trader skin recoloured, read from the Minecraft 1.20.1 jar in the CurseForge install. If yours is somewhere else, add `--jar path\to\1.20.1.jar`.

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
- Easy NPC and SVDialog (The Plug)
- Botania (LSD: alchemy and conjuration catalysts, mana infusion)
- The pack's `society:` scripts (`global.surviveCheck`, `global.cropList`, `global.trades`, `global.mushroomLogRecipes`, `global.dehydratorRecipes`, the NPC tables `npcMap`, `dialogLengths`, `maxGifts`, `villagerSpecificGifts` and `NPCMysteryGifts`, `society:mushroom_log`, `society:dehydrator`, `society:dried_tubabacco_leaf`)
