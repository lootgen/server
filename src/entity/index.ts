import { Connection } from 'typeorm';

import { Item } from './item';
import { LootBag } from './loot_bag';
import { LootItem } from './loot_item';

export const registerAllEntities = (connection: Connection): void => {
  LootBag.useConnection(connection);
  LootItem.useConnection(connection);
  Item.useConnection(connection);
};
