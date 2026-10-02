console.info("[sunlitweed] lsdRecipes.js loaded");

// Loaves and fishes: ergot bread (multiplied in a Botania mana pool) and fish mixed
// into LSD solution, then a Create line doses perforated blotter with it. The
// Dehydrator dries the sheets (startup_scripts/sunlitweed/weedDehydrator.js).
ServerEvents.recipes((e) => {
  const knife = "#forge:tools/knives";

  const manaInfusion = (input, output, mana, catalyst) => {
    const recipe = {
      type: "botania:mana_infusion",
      input: { item: input },
      mana: mana,
      output: output,
    };
    if (catalyst) recipe.catalyst = { type: "block", block: catalyst };
    e.custom(recipe);
  };

  // Ergot: 4% from mature wheat (weedLoot.js), or transmuted from wheat
  manaInfusion("minecraft:wheat", { item: "sunlitweed:ergot" }, 1500, "botania:alchemy_catalyst");

  e.shapeless("sunlitweed:ergot_loaf", ["minecraft:wheat", "minecraft:wheat", "minecraft:wheat", "sunlitweed:ergot"]);
  // The miracle: a conjuration catalyst multiplies the loaves
  manaInfusion("sunlitweed:ergot_loaf", { item: "sunlitweed:ergot_loaf", count: 2 }, 5000, "botania:conjuration_catalyst");

  // Five loaves and two fishes in a basin under a mechanical mixer -> LSD solution
  e.custom({
    type: "create:mixing",
    ingredients: [
      { item: "sunlitweed:ergot_loaf" },
      { item: "sunlitweed:ergot_loaf" },
      { item: "sunlitweed:ergot_loaf" },
      { item: "sunlitweed:ergot_loaf" },
      { item: "sunlitweed:ergot_loaf" },
      { tag: "minecraft:fishes" },
      { tag: "minecraft:fishes" },
      { fluid: "minecraft:water", amount: 1000 },
    ],
    results: [{ fluid: "sunlitweed:lsd_solution", amount: 500 }],
  });

  // Thick absorbent stock: 2 paper pressed together in a basin
  e.custom({
    type: "create:compacting",
    ingredients: [{ item: "minecraft:paper" }, { item: "minecraft:paper" }],
    results: [{ item: "sunlitweed:blank_blotter" }],
  });

  // On a belt: a deployer holding a knife perforates the sheet, then a spout doses it
  const unfinished = { item: "sunlitweed:unfinished_blotter_sheet" };
  e.custom({
    type: "create:sequenced_assembly",
    ingredient: { item: "sunlitweed:blank_blotter" },
    transitionalItem: unfinished,
    sequence: [
      {
        type: "create:deploying",
        ingredients: [unfinished, { tag: "forge:tools/knives" }],
        results: [unfinished],
        keepHeldItem: true,
      },
      {
        type: "create:filling",
        ingredients: [unfinished, { fluid: "sunlitweed:lsd_solution", amount: 100 }],
        results: [unfinished],
      },
    ],
    loops: 1,
    results: [{ item: "sunlitweed:wet_blotter_sheet" }],
  });

  // The drying rack works too. There's deliberately no fan or furnace route:
  // light and heat break it down.
  e.custom({
    type: "farm_and_charm:drying",
    ingredient: { item: "sunlitweed:wet_blotter_sheet" },
    recipe_type: "MEAT",
    result: { item: "sunlitweed:lsd_blotter_sheet", count: 1 },
  });

  // Blessed in a mana pool
  manaInfusion("sunlitweed:lsd_blotter_sheet", { item: "sunlitweed:mana_blotter_sheet" }, 10000);

  // Torn into tabs along the perforations: twelve baskets left over
  [
    ["sunlitweed:lsd_blotter_sheet", "sunlitweed:acid_tab"],
    ["sunlitweed:mana_blotter_sheet", "sunlitweed:mana_acid_tab"],
  ].forEach((entry) => {
    const sheet = entry[0];
    const tab = entry[1];
    e.custom({
      type: "create:cutting",
      ingredients: [{ item: sheet }],
      processingTime: 50,
      results: [{ item: tab, count: 12 }],
    });
    e.custom({
      type: "farmersdelight:cutting",
      ingredients: [{ item: sheet }],
      result: [{ item: tab, count: 12 }],
      tool: { tag: "forge:tools/knives" },
    });
    e.shapeless(`8x ${tab}`, [sheet, knife]).damageIngredient(knife);
  });
});
