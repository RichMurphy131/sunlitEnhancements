console.info("[sunlitweed] registerWeed.js loaded");

StartupEvents.registry("item", (e) => {
  e.create("sunlitweed:weed_stalk").texture("sunlitweed:item/weed_stalk");
  e.create("sunlitweed:dried_weed_stalk").texture("sunlitweed:item/dried_weed_stalk");
  e.create("sunlitweed:weed_bud").texture("sunlitweed:item/weed_bud");
  e.create("sunlitweed:ground_weed").texture("sunlitweed:item/ground_weed");
  e.create("sunlitweed:blunt_wrap").texture("sunlitweed:item/blunt_wrap");
  ["coca_leaf", "slaked_lime", "base_coca_paste", "refined_coca_powder", "cocaine_brick"].forEach((name) => {
    e.create(`sunlitweed:${name}`).texture(`sunlitweed:item/${name}`);
  });

  // Smoking (and snorting) settings live in weedSmoking.js
  ["joint", "blunt", "cocaine_line"].forEach((name) => {
    const id = `sunlitweed:${name}`;
    e.create(id)
      .texture(`sunlitweed:item/${name}`)
      .maxStackSize(16)
      .useAnimation("toot_horn")
      .useDuration((itemstack) => global.sunlitWeedSmokeables[id].useTicks)
      .use((level, player, hand) => global.sunlitWeedStartSmoking(level, player, hand))
      .finishUsing((itemstack, level, entity) => global.sunlitWeedFinishSmoking(itemstack, level, entity));
  });
});

// Mirrors society:tubabacco_leaf in registration/registerCrops.js: growth is
// driven by Dew Drop Farmland Growth (random tick cancelled via #minecraft:crops),
// so randomTick is intentionally empty. Seed item id = sunlitweed:<crop>_seed.
StartupEvents.registry("block", (e) => {
  const ageToStage = [0, 0, 1, 1, 2, 2, 3, 3];

  const crop = (name, harvest) => {
    e
      .create(`sunlitweed:${name}`, "crop")
      .age(7, (builder) => {
        builder
          .shape(0, 0, 0, 0, 16, 4, 16)
          .shape(1, 0, 0, 0, 16, 5, 16)
          .shape(2, 0, 0, 0, 16, 8, 16)
          .shape(3, 0, 0, 0, 16, 9, 16)
          .shape(4, 0, 0, 0, 16, 12, 16)
          .shape(5, 0, 0, 0, 16, 13, 16)
          .shape(6, 0, 0, 0, 16, 16, 16)
          .shape(7, 0, 0, 0, 16, 16, 16);
      })
      .survive((state, level, pos) => global.surviveCheck(level, pos))
      .dropSeed(false)
      .crop(harvest, 1)
      .tagBlock("minecraft:mineable/hoe")
      .tagBlock("minecraft:crops")
      .randomTick((tick) => {})
      .item((seedItem) => {
        seedItem.texture(`sunlitweed:item/${name}_seed`);
      }).blockstateJson = {
      multipart: ageToStage.map((stage, age) => ({
        when: { age: age },
        apply: { model: `sunlitweed:block/${name}_stage${stage}` },
      })),
    };
  };

  // Drops live in data/sunlitweed/loot_tables/blocks/
  crop("weed", "sunlitweed:weed_stalk");
  crop("coca", "sunlitweed:coca_leaf");
});
