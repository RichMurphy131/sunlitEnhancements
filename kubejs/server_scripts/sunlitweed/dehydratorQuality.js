console.info("[sunlitweed] dehydratorQuality.js loaded");

// The pack's Dehydrator drops quality: artisanInsert (globalBlockEntityHandlers.js) only
// records it when the block entity data already has a quality key, and the Dehydrator's
// initialData doesn't. Add the key just before someone loads weed stalks or mushrooms by
// hand (this event fires before the block's own right-click), so the batch keeps the
// lowest quality loaded, like the other artisan machines. The key stays after harvest, so
// that Dehydrator keeps quality for everything from then on.
BlockEvents.rightClicked("society:dehydrator", (e) => {
  const { block, item, hand } = e;
  if (hand != "MAIN_HAND" || !global.sunlitWeedDehydratorInputs.includes(String(item.id))) return;
  const nbt = block.getEntityData();
  if (!nbt || !nbt.data || nbt.data.quality !== undefined) return;
  nbt.merge({ data: { quality: 0 } });
  global.setBlockEntityData(block, nbt);
});
