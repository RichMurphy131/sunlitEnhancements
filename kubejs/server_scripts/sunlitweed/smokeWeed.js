console.info("[sunlitweed] smokeWeed.js loaded");

// Same style as itemEvents/smokeTubasmokeStick.js
const sunlitWeedSmokes = {
  "sunlitweed:joint": [
    ["minecraft:regeneration", 20, 0],
    ["minecraft:slowness", 15, 0],
    ["minecraft:nausea", 5, 0],
  ],
  "sunlitweed:blunt": [
    ["minecraft:regeneration", 30, 1],
    ["minecraft:slowness", 25, 0],
    ["minecraft:nausea", 8, 0],
    ["minecraft:hunger", 20, 0],
  ],
};

Object.keys(sunlitWeedSmokes).forEach((smokeable) => {
  ItemEvents.rightClicked(smokeable, (e) => {
    const { server, player, item, level } = e;
    const x = player.x;
    const y = player.y;
    const z = player.z;

    item.count--;
    server.runCommandSilent(`playsound minecraft:item.flintandsteel.use player @a ${x} ${y} ${z}`);
    server.runCommandSilent(`playsound minecraft:block.fire.extinguish player @a ${x} ${y} ${z} 0.3 1.6`);
    level.spawnParticles("minecraft:campfire_cosy_smoke", true, x, y + 1.6, z, 0.2, 0.2, 0.2, 12, 0.01);

    sunlitWeedSmokes[smokeable].forEach((fx) => {
      server.runCommandSilent(`effect give ${player.username} ${fx[0]} ${fx[1]} ${fx[2]} true`);
    });
  });
});
