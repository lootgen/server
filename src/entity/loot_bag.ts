import { Field, Int, ObjectType } from 'type-graphql';
import {
  AfterLoad,
  BaseEntity,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ILootBag } from './interfaces/loot_bag_interface';
import { ILootItem } from './interfaces/loot_item_interface';
import { LootItem } from './loot_item';

@ObjectType()
@Entity()
export class LootBag extends BaseEntity implements ILootBag {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @CreateDateColumn()
  readonly created: Date;

  @Field(() => [LootItem])
  @OneToMany(() => LootItem, (lootItem) => lootItem.bag, {
    eager: true,
    cascade: true,
  })
  items: ILootItem[];

  @AfterLoad()
  sortItems(): void {
    this.items.sort((left, right) => left.order - right.order);
  }
}
