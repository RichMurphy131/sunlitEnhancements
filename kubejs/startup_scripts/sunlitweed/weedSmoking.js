// priority: 10
console.info("[sunlitweed] weedSmoking.js loaded");

// Each smokeable is held up like a goat horn for useTicks, then smoked:
// effects applied and one item used up.
// Effects: [id, seconds, amplifier]. Quality stars stretch the durations, using the
// same multipliers the shipping bin uses for price.
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
};

// Shared with weedMushrooms.js
global.sunlitWeedQualityMultipliers = [1, 1.25, 1.5, 2];

global.sunlitWeedStartSmoking = (level, player, hand) => {
  if (!level.isClientSide()) {
    level.server.runCommandSilent(
      `playsound minecraft:item.flintandsteel.use player @a ${player.x} ${player.y} ${player.z} 0.6 1.2`
    );
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

  server.runCommandSilent(`playsound minecraft:block.fire.extinguish player @a ${x} ${y} ${z} 0.3 1.6`);
  level.spawnParticles("minecraft:campfire_cosy_smoke", true, x, y + 1.6, z, 0.2, 0.2, 0.2, 12, 0.01);
  smokeable.effects.forEach((fx) => {
    server.runCommandSilent(`effect give ${entity.uuid} ${fx[0]} ${Math.round(fx[1] * multiplier)} ${fx[2]} true`);
  });

  if (entity.isPlayer()) {
    // Stops holding right-click from chaining smokes back to back
    entity.cooldowns.addCooldown(itemstack.item, 10);
    if (entity.isCreative()) return itemstack;
  }

  itemstack.shrink(1);
  return itemstack;
};
