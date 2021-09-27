import { CensorSensor } from 'censor-sensor';
import { ILike } from 'typeorm';

import { IItem } from './interfaces/item_interface';
import { ILootItem } from './interfaces/loot_item_interface';
import { Item } from './item';
import { LootBag } from './loot_bag';
import { LootItem } from './loot_item';

const censor = new CensorSensor();
censor.disableTier(4);
censor.removeWord('hell');
censor.removeWord('damn');
censor.removeWord('damnit');
censor.removeWord('sex');
censor.removeWord('sexy');
censor.removeWord('playboy');
censor.removeWord('nude');

const itemsContainProfanity = (items: string[]): boolean => {
  return items.some((item) =>
    item.split(' ').some((word) => censor.isProfane(word))
  );
};

interface LootBagInfo {
  bags: LootBag[];
  count: number;
}

export const lootBagsForItem = async (
  item: IItem
): Promise<[LootBag[], number]> =>
  await LootBag.createQueryBuilder('bag')
    .leftJoinAndSelect('bag.items', 'items')
    .leftJoinAndSelect('items.item', 'item')
    .where('item.id = :id', { id: item.id })
    .getManyAndCount();

const smallestSetOfLootBags = async (
  lootItems: ILootItem[]
): Promise<LootBagInfo> =>
  lootItems.reduce(async (previous, lootItem): Promise<LootBagInfo> => {
    const bagInfo = await previous;
    const [bags, count] = await lootBagsForItem(lootItem.item);
    if (count < bagInfo.count) {
      return { bags, count };
    }
    return bagInfo;
  }, Promise.resolve({ bags: [], count: Number.MAX_SAFE_INTEGER }));

const sortLootItemsAlphabetically = (lootItems: ILootItem[]): ILootItem[] =>
  [...lootItems].sort((left, right) => {
    const leftName = left.item.name;
    const rightName = right.item.name;
    if (leftName < rightName) {
      return -1;
    }
    if (rightName < leftName) {
      return 1;
    }
    return 0;
  });

const findExistingLootBag = async (
  lootItems: ILootItem[]
): Promise<LootBag | undefined> => {
  const { bags } = await smallestSetOfLootBags(lootItems);
  const sortedItems = sortLootItemsAlphabetically(lootItems).map(
    (lootItem) => lootItem.item.name
  );

  for (let i = 0; i < bags.length; i++) {
    const bag = await LootBag.findOne(bags[i].id);
    if (bag === undefined) {
      continue;
    }

    const sortedBagItems = sortLootItemsAlphabetically(bag.items).map(
      (lootItem) => lootItem.item.name
    );
    if (JSON.stringify(sortedItems) === JSON.stringify(sortedBagItems)) {
      return bag;
    }
  }
};

export const makeLootBag = async (items: string[]): Promise<LootBag> => {
  if (itemsContainProfanity(items)) {
    throw Error('Error: loot items contain profanity');
  }

  let containsNewItem = false;
  const lootItems = await items.reduce(async (previous, item, index) => {
    const acc = await previous;
    let storedItem: Item;
    try {
      storedItem = await Item.findOneOrFail({
        where: { name: ILike(item) },
      });
    } catch (_error) {
      storedItem = new Item();
      storedItem.name = item;
      await storedItem.save();
      containsNewItem = true;
    }
    const lootItem = new LootItem();
    lootItem.item = storedItem;
    lootItem.order = index;
    return [...acc, lootItem];
  }, Promise.resolve([]));

  if (!containsNewItem) {
    // If this is a duplicate loot bag, return the original
    const duplicateLootBag = await findExistingLootBag(lootItems);
    if (duplicateLootBag) {
      return duplicateLootBag;
    }
  }

  const result = new LootBag();
  result.items = lootItems;
  return await result.save();
};
