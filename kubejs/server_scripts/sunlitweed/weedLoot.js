console.info("[sunlitweed] weedLoot.js loaded");

// Crop drops live in data/sunlitweed/loot_tables/blocks/weed.json.
// The pack strips #forge:seeds from grass (loot/generalLoot.js), so weed_seed
// is deliberately not tagged forge:seeds.
LootJS.modifiers((e) => {
  e.addBlockLootModifier(["minecraft:grass", "minecraft:tall_grass"])
    .randomChance(0.03)
    .addLoot("sunlitweed:weed_seed");
});
