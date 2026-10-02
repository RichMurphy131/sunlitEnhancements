// priority: -100
console.info("[sunlitweed] weedGlobals.js loaded");

// Runs after globalBlockEntityHandlers.js (priority 1000) and globalRegistry.js
// (priority -20), so the pack's globals already exist and global.trades is built.

// Quality stars, fertilizer bonuses and farming skill perks (server_scripts/loot/farmingLoot.js)
global.cropList.push("sunlitweed:weed", "sunlitweed:coca");

const sunlitWeedPrices = [
  { item: "sunlitweed:weed_seed", value: 20 },
  { item: "sunlitweed:weed_stalk", value: 60 },
  { item: "sunlitweed:dried_weed_stalk", value: 90 },
  { item: "sunlitweed:weed_bud", value: 40 },
  { item: "sunlitweed:ground_weed", value: 45 },
  { item: "sunlitweed:blunt_wrap", value: 60 },
  { item: "sunlitweed:joint", value: 140 },
  { item: "sunlitweed:blunt", value: 260 },
  { item: "sunlitweed:golden_teacher", value: 80 },
  { item: "sunlitweed:liberty_cap", value: 50 },
  { item: "sunlitweed:dried_golden_teacher", value: 110 },
  { item: "sunlitweed:dried_liberty_cap", value: 70 },
  { item: "sunlitweed:mushroom_tea_blend", value: 280 },
  { item: "sunlitweed:mushroom_tea", value: 90 },
  { item: "sunlitweed:golden_teacher_log", value: 300 },
  { item: "sunlitweed:liberty_cap_log", value: 300 },
  { item: "sunlitweed:coca_seed", value: 30 },
  { item: "sunlitweed:coca_leaf", value: 50 },
  { item: "sunlitweed:slaked_lime", value: 10 },
  { item: "sunlitweed:base_coca_paste", value: 220 },
  { item: "sunlitweed:refined_coca_powder", value: 300 },
  { item: "sunlitweed:cocaine_brick", value: 1400 },
  { item: "sunlitweed:cocaine_line", value: 200 },
];

sunlitWeedPrices.forEach((entry) => {
  // global.crops feeds the price tooltip; global.trades is what the shipping bin reads
  global.crops.push(entry);
  global.trades.set(entry.item, {
    value: global.getConfiguredValue(entry.value, "crop"),
    multiplier: "shippingbin:crop_sell_multiplier",
  });
});
