import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import { makeLootBag } from '../entity/factories';
import { LootBag } from '../entity/loot_bag';
import CreateLootBagInput from './types/create_loot_bag_input';
import FetchLootBagInput from './types/fetch_loot_bag_input';

@Resolver()
export class LootBagResolver {
  @Query((_returns) => LootBag)
  async lootBag(@Arg('input') { id }: FetchLootBagInput): Promise<LootBag> {
    return await LootBag.findOneOrFail(id);
  }

  @Mutation((_returns) => LootBag)
  async createLootBag(
    @Arg('input') { items }: CreateLootBagInput
  ): Promise<LootBag> {
    return await makeLootBag(items);
  }
}
