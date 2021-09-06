import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ILootBag } from './interfaces/loot_bag_interface';
import { ILootItem } from './interfaces/loot_item_interface';
import { LootItem } from './loot_item';

@ObjectType()
@Entity()
export class LootBag extends BaseEntity implements ILootBag {
  @Field()
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @CreateDateColumn()
  readonly created: Date;

  @Field((_type) => [LootItem])
  @ManyToMany('LootItem', {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  items: ILootItem[];
}
