// priority: -10
console.info("[sunlitweed] plugNpc.js loaded");

// The Plug, a Society town NPC. Server scripts share one scope, and this runs after the
// pack's npcs/ scripts, so it adds The Plug to their lookup tables. npcInteraction.js has
// no fallback for an NPC missing from dialogLengths or maxGifts.
// Dialog files and lines: tools/gen_plug_dialog.py. Shop: data/society_trading/shops/plug.json.
// Preset and skin: config/easy_npc/ (tools/gen_plug_npc.py).

// villagerHomeMechanics.js: preset imported when the villager home is placed
npcMap.set("plug", "humanoid/plug");

// npcInteraction.js: how many chatter dialogs per heart level, and gift replies per reaction
dialogLengths.plug = {
  chatterLengths: [3, 3, 3, 3, 3, 3],
  giftResponseLengths: { loved: 2, liked: 2, neutral: 2, disliked: 2, hated: 2 },
};

// npcInteraction.js: given once at max friendship
maxGifts.plug = "8x sunlitweed:cocaine_brick";
