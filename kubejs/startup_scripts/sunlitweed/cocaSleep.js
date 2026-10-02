console.info("[sunlitweed] cocaSleep.js loaded");

// The comedown from a line: no sleeping until the next morning (6am, when the
// Minecraft day ticks over). Stored on the player so it survives relogging.
// PlayerSleepInBedEvent isn't cancelable, so refuse the bed with a sleeping problem.
const SunlitWeedBedProblem = Java.loadClass("net.minecraft.world.entity.player.Player$BedSleepingProblem");

global.sunlitWeedBanSleep = (player, level) => {
  player.persistentData.putLong("sunlitweedNoSleepDay", Math.floor(level.dayTime() / 24000));
};

global.handleSunlitWeedSleep = (e) => {
  const { entity } = e;
  if (!entity.isPlayer()) return;
  const data = entity.persistentData;
  if (!data.contains("sunlitweedNoSleepDay")) return;
  if (Math.floor(entity.level.dayTime() / 24000) > data.getLong("sunlitweedNoSleepDay")) {
    data.remove("sunlitweedNoSleepDay");
    return;
  }
  entity.tell(Text.translatable("message.sunlitweed.cant_sleep").gray());
  e.setResult(SunlitWeedBedProblem.OTHER_PROBLEM);
};

ForgeEvents.onEvent("net.minecraftforge.event.entity.player.PlayerSleepInBedEvent", (e) => {
  global.handleSunlitWeedSleep(e);
});
