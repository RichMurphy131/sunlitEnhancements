console.info("[sunlitweed] weedTrip.js loaded");

// Client side of a mushroom trip (started by global.sunlitWeedStartTrip in
// startup_scripts/sunlitweed/weedMushrooms.js): cycles vanilla post shaders, plus
// stray particles and odd sounds. Post shaders may not show with an Oculus shaderpack on.
const $ResourceLocation = Java.loadClass("net.minecraft.resources.ResourceLocation");
const $BuiltInRegistries = Java.loadClass("net.minecraft.core.registries.BuiltInRegistries");

const sunlitTripShaders = [
  "wobble",
  "deconverge",
  "phosphor",
  "color_convolve",
  "blobs2",
  "ntsc",
  "bumpy",
  "art",
  "scan_pincushion",
  "notch",
];
// Short flashes, golden teachers (intensity 2) only
const sunlitTripFlashes = ["invert", "flip"];
const sunlitTripParticles = ["minecraft:end_rod", "minecraft:enchant", "minecraft:glow", "minecraft:note"];
const sunlitTripSounds = [
  "minecraft:block.amethyst_block.chime",
  "minecraft:entity.allay.ambient_without_item",
  "minecraft:block.note_block.pling",
  "minecraft:block.note_block.chime",
];
// Ticks each shader stays on: SHADER_MIN + up to SHADER_SPREAD
const SUNLIT_TRIP_SHADER_MIN = 120;
const SUNLIT_TRIP_SHADER_SPREAD = 80;
const SUNLIT_TRIP_FLASH_TICKS = 20;

const sunlitTrip = { ticksLeft: 0, intensity: 0, shaderTicks: 0, flashTicks: 0, shaderBroken: false };

const sunlitTripPick = (list) => list[Math.floor(Math.random() * list.length)];

const sunlitTripLoadShader = (name) => {
  if (sunlitTrip.shaderBroken) return;
  try {
    Client.gameRenderer.loadEffect(new $ResourceLocation("minecraft", `shaders/post/${name}.json`));
  } catch (err) {
    // Don't retry every few seconds if this setup can't load post shaders
    sunlitTrip.shaderBroken = true;
    console.warn(`[sunlitweed] couldn't load trip shader ${name}: ${err}`);
  }
};

const sunlitTripEnd = () => {
  sunlitTrip.ticksLeft = 0;
  sunlitTrip.intensity = 0;
  sunlitTrip.shaderTicks = 0;
  sunlitTrip.flashTicks = 0;
  if (Client.gameRenderer) Client.gameRenderer.shutdownEffect();
};

NetworkEvents.dataReceived("sunlitweed:trip", (e) => {
  // Another mushroom mid-trip extends it rather than restarting
  sunlitTrip.ticksLeft += e.data.getInt("seconds") * 20;
  sunlitTrip.intensity = Math.max(sunlitTrip.intensity, e.data.getInt("intensity"));
});

ClientEvents.tick((e) => {
  if (sunlitTrip.ticksLeft <= 0) return;
  const player = Client.player;
  if (!player || !Client.level) return;

  sunlitTrip.ticksLeft--;
  if (sunlitTrip.ticksLeft <= 0) {
    sunlitTripEnd();
    return;
  }

  if (sunlitTrip.flashTicks > 0 && --sunlitTrip.flashTicks == 0) sunlitTrip.shaderTicks = 0;
  if (--sunlitTrip.shaderTicks <= 0) {
    if (sunlitTrip.intensity >= 2 && Math.random() < 0.15) {
      sunlitTripLoadShader(sunlitTripPick(sunlitTripFlashes));
      sunlitTrip.flashTicks = SUNLIT_TRIP_FLASH_TICKS;
      sunlitTrip.shaderTicks = SUNLIT_TRIP_FLASH_TICKS + 1;
    } else {
      sunlitTripLoadShader(sunlitTripPick(sunlitTripShaders));
      sunlitTrip.shaderTicks = SUNLIT_TRIP_SHADER_MIN + Math.floor(Math.random() * SUNLIT_TRIP_SHADER_SPREAD);
    }
  }

  // Stray sparkles around the player, more on golden teachers
  if (Math.random() < 0.25 * sunlitTrip.intensity) {
    const particle = $BuiltInRegistries.PARTICLE_TYPE.get(new $ResourceLocation(sunlitTripPick(sunlitTripParticles)));
    Client.level.addParticle(
      particle,
      player.x + (Math.random() - 0.5) * 6,
      player.y + Math.random() * 2.5,
      player.z + (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 0.05,
      0.02,
      (Math.random() - 0.5) * 0.05
    );
  }

  // Now and then, a sound from nowhere at a strange pitch
  if (Math.random() < 0.004 * sunlitTrip.intensity) {
    const sound = $BuiltInRegistries.SOUND_EVENT.get(new $ResourceLocation(sunlitTripPick(sunlitTripSounds)));
    player.playNotifySound(sound, "ambient", 0.4, 0.5 + Math.random());
  }
});

ClientEvents.loggedOut((e) => sunlitTripEnd());
