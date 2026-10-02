console.info("[sunlitweed] mushroomRecipes.js loaded");

// Mushrooms (startup_scripts/sunlitweed/weedMushrooms.js)
ServerEvents.recipes((e) => {
  // Inoculated logs for the Mushroom Log, and drying (the Dehydrator keeps quality,
  // the drying rack loses it)
  ["golden_teacher", "liberty_cap"].forEach((mushroom) => {
    e.shapeless(`sunlitweed:${mushroom}_log`, ["#minecraft:logs", `sunlitweed:${mushroom}`, `sunlitweed:${mushroom}`]);
    e.custom({
      type: "farm_and_charm:drying",
      ingredient: { item: `sunlitweed:${mushroom}` },
      recipe_type: "MEAT",
      result: { item: `sunlitweed:dried_${mushroom}`, count: 1 },
    });
  });

  // Mushroom tea: the Tea Kettle only has 5 ingredient slots, each taking one item, so the
  // 2 mushrooms + 4 leaves are combined into a blend first (like the pack's chai blend)
  e.shapeless("sunlitweed:mushroom_tea_blend", [
    "2x #sunlitweed:dried_mushrooms",
    "4x #sunlitweed:tea_leaves",
  ]);
  e.custom({
    type: "herbalbrews:kettle_brewing",
    experience: 0.8,
    crafting_duration: 25,
    fluid: [{ amount: 20 }],
    heat_needed: [{ amount: 40 }],
    ingredients: [{ item: "sunlitweed:mushroom_tea_blend" }],
    result: { item: "sunlitweed:mushroom_tea", count: 4 },
  });
});
