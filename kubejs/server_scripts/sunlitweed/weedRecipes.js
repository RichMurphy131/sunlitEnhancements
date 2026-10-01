console.info("[sunlitweed] weedRecipes.js loaded");

ServerEvents.recipes((e) => {
  const knife = "#forge:tools/knives";

  const cutting = (input, output, count) => {
    e.custom({
      type: "farmersdelight:cutting",
      ingredients: [{ item: input }],
      result: [{ item: output, count: count }],
      tool: { tag: "forge:tools/knives" },
    });
  };

  // Harvested stalk -> drying rack -> dried stalk
  e.custom({
    type: "farm_and_charm:drying",
    ingredient: { item: "sunlitweed:weed_stalk" },
    recipe_type: "MEAT",
    result: { item: "sunlitweed:dried_weed_stalk", count: 1 },
  });

  // Dried stalk -> trimmed buds (cutting board is the better yield)
  cutting("sunlitweed:dried_weed_stalk", "sunlitweed:weed_bud", 3);
  e.shapeless("2x sunlitweed:weed_bud", ["sunlitweed:dried_weed_stalk", knife]).damageIngredient(knife);

  // Buds -> ground weed: mincer, Create millstone, Create crushing wheels
  e.custom({
    type: "farm_and_charm:mincer",
    ingredient: { item: "sunlitweed:weed_bud" },
    recipe_type: "MEAT",
    result: { item: "sunlitweed:ground_weed", count: 2 },
  });
  e.custom({
    type: "create:milling",
    ingredients: [{ item: "sunlitweed:weed_bud" }],
    processingTime: 40,
    results: [{ item: "sunlitweed:ground_weed", count: 2 }],
  });
  e.custom({
    type: "create:crushing",
    ingredients: [{ item: "sunlitweed:weed_bud" }],
    processingTime: 100,
    results: [
      { item: "sunlitweed:ground_weed", count: 2 },
      { item: "sunlitweed:ground_weed", count: 1, chance: 0.25 },
    ],
  });

  // Dried tubabacco leaf -> blunt wraps
  e.custom({
    type: "create:pressing",
    ingredients: [{ item: "society:dried_tubabacco_leaf" }],
    results: [{ item: "sunlitweed:blunt_wrap", count: 2 }],
  });
  cutting("society:dried_tubabacco_leaf", "sunlitweed:blunt_wrap", 2);
  e.shapeless("sunlitweed:blunt_wrap", ["society:dried_tubabacco_leaf", knife]).damageIngredient(knife);

  // Rolling
  e.shapeless("sunlitweed:joint", ["sunlitweed:ground_weed", "minecraft:paper"]);
  e.shapeless("2x sunlitweed:joint", [
    "sunlitweed:ground_weed",
    "society:dried_tubabacco_leaf",
    "minecraft:paper",
  ]);
  e.shapeless("sunlitweed:blunt", [
    "sunlitweed:ground_weed",
    "sunlitweed:ground_weed",
    "sunlitweed:blunt_wrap",
  ]);
});
