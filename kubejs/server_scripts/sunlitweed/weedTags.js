console.info("[sunlitweed] weedTags.js loaded");

const sunlitWeedSeasons = ["spring", "summer", "autumn"];
const sunlitCocaSeasons = ["summer", "autumn"];

ServerEvents.tags("item", (e) => {
  sunlitWeedSeasons.forEach((season) => {
    e.add(`sereneseasons:${season}_crops`, ["sunlitweed:weed_seed", "sunlitweed:weed_stalk"]);
  });
  sunlitCocaSeasons.forEach((season) => {
    e.add(`sereneseasons:${season}_crops`, ["sunlitweed:coca_seed", "sunlitweed:coca_leaf"]);
  });
  // Lets harvested stalks and their products carry quality stars
  e.add("quality_food:material_whitelist", [
    "sunlitweed:weed_stalk",
    "sunlitweed:dried_weed_stalk",
    "sunlitweed:weed_bud",
    "sunlitweed:ground_weed",
    "sunlitweed:blunt_wrap",
    "sunlitweed:joint",
    "sunlitweed:blunt",
    "sunlitweed:golden_teacher",
    "sunlitweed:liberty_cap",
    "sunlitweed:dried_golden_teacher",
    "sunlitweed:dried_liberty_cap",
    "sunlitweed:mushroom_tea_blend",
    "sunlitweed:coca_leaf",
    "sunlitweed:base_coca_paste",
    "sunlitweed:refined_coca_powder",
    "sunlitweed:cocaine_brick",
    "sunlitweed:cocaine_line",
  ]);
  // Mushroom Tea Blend takes any mix of these
  e.add("sunlitweed:dried_mushrooms", ["sunlitweed:dried_golden_teacher", "sunlitweed:dried_liberty_cap"]);
  // Any Herbalbrews tea leaf works for mushroom tea
  e.add("sunlitweed:tea_leaves", [
    "herbalbrews:green_tea_leaf",
    "herbalbrews:dried_green_tea",
    "herbalbrews:dried_black_tea",
    "herbalbrews:dried_oolong_tea",
  ]);
});

ServerEvents.tags("block", (e) => {
  sunlitWeedSeasons.forEach((season) => {
    e.add(`sereneseasons:${season}_crops`, "sunlitweed:weed");
  });
  sunlitCocaSeasons.forEach((season) => {
    e.add(`sereneseasons:${season}_crops`, "sunlitweed:coca");
  });
});
