// priority: 10
console.info("[sunlitweed] weedSmoking.js loaded");

// Each smokeable is held up like a goat horn for useTicks, then smoked:
// effects applied and one item used up.
// Effects: [id, seconds, amplifier]. Quality stars stretch the durations, using the
// same multipliers the shipping bin uses for price.
// Optional: startSound / finishSound ([id, volume, pitch]), particle, and noSleep
// (no sleeping until the next morning, see cocaSleep.js).
global.sunlitWeedSmokeables = {
  "sunlitweed:joint": {
    useTicks: 30,
    effects: [
      ["minecraft:regeneration", 20, 0],
      ["minecraft:slowness", 15, 0],
      ["minecraft:nausea", 5, 0],
    ],
  },
  "sunlitweed:blunt": {
    useTicks: 40,
    effects: [
      ["minecraft:regeneration", 30, 1],
      ["minecraft:slowness", 25, 0],
      ["minecraft:nausea", 8, 0],
      ["minecraft:hunger", 20, 0],
    ],
  },
  "sunlitweed:cocaine_line": {
    useTicks: 20,
    startSound: ["minecraft:entity.fox.sniff", 0.8, 1.4],
    finishSound: ["minecraft:entity.fox.sniff", 1.0, 0.8],
    particle: "minecraft:white_ash",
    noSleep: true,
    effects: [
      ["minecraft:speed", 300, 1],
      ["minecraft:haste", 300, 1],
    ],
  },
};

const sunlitWeedSmokeDefaults = {
  startSound: ["minecraft:item.flintandsteel.use", 0.6, 1.2],
  finishSound: ["minecraft:block.fire.extinguish", 0.3, 1.6],
  particle: "minecraft:campfire_cosy_smoke",
};

const sunlitWeedPlaySound = (server, sound, x, y, z) => {
  server.runCommandSilent(`playsound ${sound[0]} player @a ${x} ${y} ${z} ${sound[1]} ${sound[2]}`);
};

// Shared with weedMushrooms.js
global.sunlitWeedQualityMultipliers = [1, 1.25, 1.5, 2];

global.sunlitWeedStartSmoking = (level, player, hand) => {
  if (!level.isClientSide()) {
    const smokeable = global.sunlitWeedSmokeables[player.getItemInHand(hand).id];
    const sound = smokeable.startSound || sunlitWeedSmokeDefaults.startSound;
    sunlitWeedPlaySound(level.server, sound, player.x, player.y, player.z);
  }
  return true;
};

global.sunlitWeedFinishSmoking = (itemstack, level, entity) => {
  if (level.isClientSide()) return itemstack;

  const smokeable = global.sunlitWeedSmokeables[itemstack.id];
  const nbt = itemstack.nbt;
  const quality = nbt && nbt.quality_food ? Number(nbt.quality_food.quality) : 0;
  const multiplier = global.sunlitWeedQualityMultipliers[quality] || 1;
  const { server } = level;
  const x = entity.x;
  const y = entity.y;
  const z = entity.z;

  sunlitWeedPlaySound(server, smokeable.finishSound || sunlitWeedSmokeDefaults.finishSound, x, y, z);
  const particle = smokeable.particle || sunlitWeedSmokeDefaults.particle;
  level.spawnParticles(particle, true, x, y + 1.6, z, 0.2, 0.2, 0.2, 12, 0.01);
  smokeable.effects.forEach((fx) => {
    server.runCommandSilent(`effect give ${entity.uuid} ${fx[0]} ${Math.round(fx[1] * multiplier)} ${fx[2]} true`);
  });

  if (entity.isPlayer()) {
    if (smokeable.noSleep) global.sunlitWeedBanSleep(entity, level);
    // Stops holding right-click from chaining smokes back to back
    entity.cooldowns.addCooldown(itemstack.item, 10);
    if (entity.isCreative()) return itemstack;
  }

  itemstack.shrink(1);
  return itemstack;
};
