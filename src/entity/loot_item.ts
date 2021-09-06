import { Field, ID, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { IItem } from './interfaces/item_interface';
import { ILootBag } from './interfaces/loot_bag_interface';
import { ILootItem } from './interfaces/loot_item_interface';
import { Item } from './item';
import { LootBag } from './loot_bag';

@ObjectType()
@Entity()
export class LootItem extends BaseEntity implements ILootItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Field(() => Item)
  @ManyToOne(() => Item, { eager: true, cascade: true })
  item: IItem;

  @Field(() => LootBag)
  @ManyToOne(() => LootBag, (lootBag) => lootBag.items)
  bag: ILootBag;

  @Field(() => Int)
  @Column()
  order: number;
}
