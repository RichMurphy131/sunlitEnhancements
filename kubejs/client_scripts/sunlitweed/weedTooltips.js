ItemEvents.tooltip((tooltip) => {
  [
    "weed_seed",
    "weed_stalk",
    "dried_weed_stalk",
    "weed_bud",
    "ground_weed",
    "blunt_wrap",
    "joint",
    "blunt",
  ].forEach((id) => {
    tooltip.add(`sunlitweed:${id}`, Text.translatable(`tooltip.sunlitweed.${id}`).gray());
  });
});
