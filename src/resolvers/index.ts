import { ClassType, NonEmptyArray } from 'type-graphql';

import { LootBagResolver } from './loot_bag_resolver';

export const ALL_RESOLVERS: NonEmptyArray<ClassType> = [LootBagResolver];
