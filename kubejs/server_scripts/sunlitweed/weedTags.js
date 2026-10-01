console.info("[sunlitweed] weedTags.js loaded");

const sunlitWeedSeasons = ["spring", "summer", "autumn"];

ServerEvents.tags("item", (e) => {
  sunlitWeedSeasons.forEach((season) => {
    e.add(`sereneseasons:${season}_crops`, ["sunlitweed:weed_seed", "sunlitweed:weed_stalk"]);
  });
  // Lets harvested stalks and their products carry quality stars
  e.add("quality_food:material_whitelist", [
    "sunlitweed:weed_stalk",
    "sunlitweed:dried_weed_stalk",
    "sunlitweed:weed_bud",
  ]);
});

ServerEvents.tags("block", (e) => {
  sunlitWeedSeasons.forEach((season) => {
    e.add(`sereneseasons:${season}_crops`, "sunlitweed:weed");
  });
});
