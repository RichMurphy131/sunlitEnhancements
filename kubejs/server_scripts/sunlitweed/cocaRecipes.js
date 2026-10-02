console.info("[sunlitweed] cocaRecipes.js loaded");

// Quality Food carries quality stars through Create basins, fans and crushers and the
// cutting board for the items in quality_food:material_whitelist (weedTags.js).
ServerEvents.recipes((e) => {
  const knife = "#forge:tools/knives";

  // Create limestone -> slaked lime (its only source)
  e.custom({
    type: "create:crushing",
    ingredients: [{ item: "create:limestone" }],
    processingTime: 150,
    results: [
      { item: "sunlitweed:slaked_lime", count: 2 },
      { item: "sunlitweed:slaked_lime", count: 1, chance: 0.25 },
    ],
  });
  e.custom({
    type: "create:milling",
    ingredients: [{ item: "create:limestone" }],
    processingTime: 100,
    results: [{ item: "sunlitweed:slaked_lime", count: 1 }],
  });

  // Leaves + lime + water in a basin under a mechanical mixer -> base paste
  e.custom({
    type: "create:mixing",
    ingredients: [
      { item: "sunlitweed:coca_leaf" },
      { item: "sunlitweed:coca_leaf" },
      { item: "sunlitweed:coca_leaf" },
      { item: "sunlitweed:coca_leaf" },
      { item: "sunlitweed:slaked_lime" },
      { fluid: "minecraft:water", amount: 250 },
    ],
    results: [{ item: "sunlitweed:base_coca_paste", count: 1 }],
  });

  // Paste -> refined powder. An encased fan blowing through lava or fire runs blasting
  // recipes when there's no smelting one, so this is fan (or blast furnace) only.
  e.custom({
    type: "minecraft:blasting",
    ingredient: { item: "sunlitweed:base_coca_paste" },
    result: "sunlitweed:refined_coca_powder",
    experience: 0.2,
    cookingtime: 100,
  });

  // Powder pressed in a basin -> brick
  e.custom({
    type: "create:compacting",
    ingredients: [
      { item: "sunlitweed:refined_coca_powder" },
      { item: "sunlitweed:refined_coca_powder" },
      { item: "sunlitweed:refined_coca_powder" },
      { item: "sunlitweed:refined_coca_powder" },
    ],
    results: [{ item: "sunlitweed:cocaine_brick", count: 1 }],
  });

  // Brick -> lines (cutting board is the better yield)
  e.custom({
    type: "farmersdelight:cutting",
    ingredients: [{ item: "sunlitweed:cocaine_brick" }],
    result: [{ item: "sunlitweed:cocaine_line", count: 8 }],
    tool: { tag: "forge:tools/knives" },
  });
  e.shapeless("6x sunlitweed:cocaine_line", ["sunlitweed:cocaine_brick", knife]).damageIngredient(knife);
});
