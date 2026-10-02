// priority: -100
console.info("[sunlitweed] plugGifts.js loaded");

// The Plug's gift tastes (globalNPCHandlers.js) and his Cobblemon mystery gift at max
// friendship (cobblemon/cobblemonUtils.js). Runs after both, sharing their scope.
villagerSpecificGifts.set("plug", {
  loved: ["sunlitweed:cocaine_brick", "sunlitweed:refined_coca_powder", "sunlitweed:base_coca_paste"],
  liked: [
    "sunlitweed:joint",
    "sunlitweed:blunt",
    "sunlitweed:dried_golden_teacher",
    "sunlitweed:dried_liberty_cap",
    "sunlitweed:coca_leaf",
    "herbalbrews:coffee",
    "society:espresso",
  ],
  neutral: [],
  disliked: ["herbalbrews:milk_coffee", "society:energy_drink"],
  hated: ["society:tubasmoke_stick", "society:tubasmoke_carton"],
});

NPCMysteryGifts.plug = "zarude";
