console.info("[sunlitweed] shadyTrader.js loaded");

// The Shady Trader is a vanilla wandering trader with a name and a tag. Entity Texture
// Features gives it the rasta skin by name (assets/minecraft/optifine/random/entity/),
// and its shop is data/society_trading/shops/sunlitweed_shady_trader.json.
// Spawning copies the vanilla wanderer: a check every DELAY ticks with a chance that
// climbs after each miss, near a random overworld player, one at a time.
const SHADY_TAG = "sunlitweed_shady_trader";
const SHADY_SHOP = "sunlitweed_shady_trader";
const SHADY_CHECK_TICKS = 1200;
const SHADY_DELAY = 24000;
const SHADY_CHANCE_START = 25;
const SHADY_CHANCE_STEP = 25;
const SHADY_CHANCE_MAX = 75;
const SHADY_RADIUS = 48;
const SHADY_STAY_TICKS = 48000;

const $Heightmap$Types = Java.loadClass("net.minecraft.world.level.levelgen.Heightmap$Types");
const $GameRules = Java.loadClass("net.minecraft.world.level.GameRules");

const shadyIsShadyTrader = (entity) =>
  entity && String(entity.type) === "minecraft:wandering_trader" && entity.tags.contains(SHADY_TAG);

const shadyFindSpot = (level, player) => {
  for (let i = 0; i < 10; i++) {
    const x = Math.floor(player.x + (Math.random() * 2 - 1) * SHADY_RADIUS);
    const z = Math.floor(player.z + (Math.random() * 2 - 1) * SHADY_RADIUS);
    const y = level.getHeight($Heightmap$Types.MOTION_BLOCKING_NO_LEAVES, x, z);
    const ground = level.getBlock(x, y - 1, z).blockState;
    if (
      ground.isSolid() &&
      level.getBlock(x, y, z).blockState.isAir() &&
      level.getBlock(x, y + 1, z).blockState.isAir()
    ) {
      return { x: x, y: y, z: z };
    }
  }
  return null;
};

const shadyTrySpawn = (server) => {
  const level = server.overworld();
  const players = [];
  for (let p of level.players()) {
    if (!p.isSpectator()) players.push(p);
  }
  if (players.length == 0) return false;
  const player = players[Math.floor(Math.random() * players.length)];
  const spot = shadyFindSpot(level, player);
  if (!spot) return false;

  server.runCommandSilent(
    `execute in minecraft:overworld run summon minecraft:wandering_trader ${spot.x + 0.5} ${spot.y} ${spot.z + 0.5} ` +
      `{CustomName:'"Shady Trader"',Tags:["${SHADY_TAG}"],DespawnDelay:${SHADY_STAY_TICKS},Offers:{Recipes:[]}}`
  );
  player.setStatusMessage(Text.translatable("message.sunlitweed.shady_trader_nearby").darkGreen().italic());
  console.info(`[sunlitweed] Shady Trader spawned at ${spot.x} ${spot.y} ${spot.z} near ${player.username}`);
  return true;
};

ServerEvents.tick((e) => {
  const { server } = e;
  if (server.tickCount % SHADY_CHECK_TICKS != 0) return;

  const data = server.persistentData;
  if (!data.contains("sunlitweedShadyDelay")) {
    data.putInt("sunlitweedShadyDelay", SHADY_DELAY);
    data.putInt("sunlitweedShadyChance", SHADY_CHANCE_START);
  }
  const delay = data.getInt("sunlitweedShadyDelay") - SHADY_CHECK_TICKS;
  if (delay > 0) {
    data.putInt("sunlitweedShadyDelay", delay);
    return;
  }
  data.putInt("sunlitweedShadyDelay", SHADY_DELAY);

  if (!server.gameRules.getBoolean($GameRules.RULE_DO_TRADER_SPAWNING)) return;
  const level = server.overworld();
  for (let entity of level.getEntities()) {
    if (shadyIsShadyTrader(entity)) return;
  }

  const chance = data.getInt("sunlitweedShadyChance");
  if (Math.random() * 100 < chance && shadyTrySpawn(server)) {
    data.putInt("sunlitweedShadyChance", SHADY_CHANCE_START);
  } else {
    data.putInt("sunlitweedShadyChance", Math.min(SHADY_CHANCE_MAX, chance + SHADY_CHANCE_STEP));
  }
});

// society_trading returns the first shop whose entity type matches, and the registry is
// hash-ordered, so the plain wanderer shop could win. KubeJS sees the interaction first
// (Architectury listens at HIGH, society_trading at NORMAL and skips cancelled events):
// cancel it and open our shop directly.
ItemEvents.entityInteracted((e) => {
  const { player, target, hand, server } = e;
  if (!shadyIsShadyTrader(target)) return;
  if (hand == "MAIN_HAND") {
    server.runCommandSilent(`openshop ${player.username} ${SHADY_SHOP}`);
  }
  e.cancel();
});
