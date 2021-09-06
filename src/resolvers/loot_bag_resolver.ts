import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { ILike } from 'typeorm';

import { LootBag } from '../entity/loot_bag';
import { LootItem } from '../entity/loot_item';
import CreateLootBagInput from './types/create_loot_bag_input';
import FetchItemInput from './types/fetch_item_input';

@Resolver()
export class LootBagResolver {
  @Query((_returns) => LootBag)
  async lootBag(@Arg('input') { id }: FetchItemInput): Promise<LootBag> {
    return await LootBag.findOneOrFail(id);
  }

  @Mutation((_returns) => LootBag)
  async createLootBag(
    @Arg('input') { items }: CreateLootBagInput
  ): Promise<LootBag> {
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
    return await result.save();
  }
}
