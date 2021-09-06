import { ILike } from 'typeorm';

import { LootBag } from './loot_bag';
import { LootItem } from './loot_item';

export const makeLootBag = async (items: string[]): Promise<LootBag> => {
  const lootItems = await items.reduce(async (previous, item) => {
    const acc = await previous;
    try {
      const result = await LootItem.findOneOrFail({
        where: { name: ILike(item) },
      });
      return [...acc, result];
    } catch (_error) {
      const result = new LootItem();
      result.name = item;
      await result.save();
      return [...acc, result];
    }
  }, Promise.resolve([]));
  const result = new LootBag();
  result.items = lootItems;
  result.raw = lootItems.map((item) => item.name).join('\n');
  return await result.save();
};
