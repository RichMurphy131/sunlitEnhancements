console.info("[sunlitweed] farmTweaks.js loaded");

// Small tweaks to the pack's own farming items. Server script, so /reload picks up changes.
ServerEvents.recipes((e) => {
  // Farm & Charm Silo: Low Quality Fertilizer -> Plant Nutrients (farm_and_charm:fertilizer),
  // same shape as the mod's own rotten flesh -> Plant Nutrients recipe
  e.custom({
    type: "farm_and_charm:drying",
    recipe_type: "MEAT",
    ingredient: { item: "dew_drop_farmland_growth:low_quality_fertilizer" },
    result: { item: "farm_and_charm:fertilizer", count: 1 },
  });
});
