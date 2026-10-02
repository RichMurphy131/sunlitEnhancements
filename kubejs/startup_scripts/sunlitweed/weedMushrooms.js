// priority: 0
console.info("[sunlitweed] weedMushrooms.js loaded");

// Golden teachers and liberty caps. Fresh ones can't be eaten: dry them (Dehydrator
// keeps quality, drying rack loses it), then eat them, or make a Mushroom Tea Blend and
// brew it into 4 cups of tea in a Herbalbrews Tea Kettle. Each gives a trip (nausea +
// night vision bursts here, screen shaders/particles/sounds in
// client_scripts/sunlitweed/weedTrip.js). Quality stars stretch the trip like smoking.
// Acid tabs (lsdRecipes.js) are eaten the same way, for longer and stronger trips;
// intensity 4 adds Botania sounds and mana sparkles.
global.sunlitWeedTrips = {
  "sunlitweed:dried_golden_teacher": { seconds: 120, intensity: 2 },
  "sunlitweed:dried_liberty_cap": { seconds: 60, intensity: 1 },
  "sunlitweed:mushroom_tea": { seconds: 120, intensity: 2 },
  "sunlitweed:acid_tab": { seconds: 240, intensity: 3 },
  "sunlitweed:mana_acid_tab": { seconds: 360, intensity: 4 },
};
// Night vision bursts: one every SUNLITWEED_NV_EVERY seconds, each SUNLITWEED_NV_SECONDS long
const SUNLITWEED_NV_EVERY = 20;
const SUNLITWEED_NV_SECONDS = 4;

// Inoculated logs are dominant for the pack's Mushroom Log (customMachines/mushroomLog.js,
// priority 100): one within 8 blocks makes it grow these instead of its usual mushrooms.
// The society:mushroom_log_detects/_dominant tags are built from these Maps server-side.
const sunlitWeedMushroomLogs = [
  ["sunlitweed:golden_teacher_log", { output: ["2x sunlitweed:golden_teacher"] }],
  ["sunlitweed:liberty_cap_log", { output: ["3x sunlitweed:liberty_cap"] }],
];
sunlitWeedMushroomLogs.forEach((entry) => {
  global.dominantMushroomLogBlocks.set(entry[0], entry[1]);
  // mushroomLog.js copied the dominant Map into the recipe Map before this ran
  global.mushroomLogRecipes.set(entry[0], entry[1]);
});

global.sunlitWeedStartTrip = (ctx) => {
  const { player, item, level } = ctx;
  if (!player || level.isClientSide()) return;

  const trip = global.sunlitWeedTrips[item.id];
  const nbt = item.nbt;
  const quality = nbt && nbt.quality_food ? Number(nbt.quality_food.quality) : 0;
  const seconds = Math.round(trip.seconds * (global.sunlitWeedQualityMultipliers[quality] || 1));
  const { server } = level;

  server.runCommandSilent(`effect give ${player.uuid} minecraft:nausea ${seconds} 0 true`);
  for (let at = 0; at < seconds; at += SUNLITWEED_NV_EVERY) {
    server.scheduleInTicks(at * 20 + 1, () => {
      server.runCommandSilent(`effect give ${player.uuid} minecraft:night_vision ${SUNLITWEED_NV_SECONDS} 0 true`);
    });
  }
  player.sendData("sunlitweed:trip", { seconds: seconds, intensity: trip.intensity });
};

StartupEvents.registry("item", (e) => {
  ["golden_teacher", "liberty_cap", "mushroom_tea_blend"].forEach((name) => {
    e.create(`sunlitweed:${name}`).texture(`sunlitweed:item/${name}`);
  });
  Object.keys(global.sunlitWeedTrips).forEach((id) => {
    const tea = id.endsWith("_tea");
    e.create(id)
      .texture(id.replace(":", ":item/"))
      .maxStackSize(tea ? 16 : 64)
      .useAnimation(tea ? "drink" : "eat")
      .food((food) => {
        food
          .hunger(1)
          .saturation(0.1)
          .alwaysEdible()
          .eaten((ctx) => global.sunlitWeedStartTrip(ctx));
      });
  });
});

StartupEvents.registry("block", (e) => {
  sunlitWeedMushroomLogs.forEach((entry) => {
    e.create(entry[0])
      .soundType("wood")
      .hardness(2)
      .tagBlock("minecraft:mineable/axe")
      .model(entry[0].replace(":", ":block/"));
  });
});
