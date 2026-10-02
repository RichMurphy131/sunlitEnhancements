// priority: 0
console.info("[sunlitweed] weedDehydrator.js loaded");

// Drying in the pack's Dehydrator (customMachines/dehydrator.js, priority 100): it takes a
// batch of 8 of one item and finishes overnight. These give the whole batch back dried.
// Quality is kept by server_scripts/sunlitweed/dehydratorQuality.js.
const SUNLITWEED_DEHYDRATOR_BATCH = 8;
const sunlitWeedDehydratorRecipes = [
  ["sunlitweed:weed_stalk", "sunlitweed:dried_weed_stalk"],
  ["sunlitweed:golden_teacher", "sunlitweed:dried_golden_teacher"],
  ["sunlitweed:liberty_cap", "sunlitweed:dried_liberty_cap"],
  // Dosed blotter dries in the dark; light and heat would break it down
  ["sunlitweed:wet_blotter_sheet", "sunlitweed:lsd_blotter_sheet"],
];
sunlitWeedDehydratorRecipes.forEach((entry) => {
  global.dehydratorRecipes.set(entry[0], { output: [`${SUNLITWEED_DEHYDRATOR_BATCH}x ${entry[1]}`] });
});
global.sunlitWeedDehydratorInputs = sunlitWeedDehydratorRecipes.map((entry) => entry[0]);

// A cordycep-upgraded Dehydrator doubles mushroom batches, ours included
global.dehydratableMushrooms.push("sunlitweed:golden_teacher", "sunlitweed:liberty_cap");
