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
    "golden_teacher",
    "liberty_cap",
    "dried_golden_teacher",
    "dried_liberty_cap",
    "mushroom_tea_blend",
    "mushroom_tea",
    "golden_teacher_log",
    "liberty_cap_log",
  ].forEach((id) => {
    tooltip.add(`sunlitweed:${id}`, Text.translatable(`tooltip.sunlitweed.${id}`).gray());
  });
});
