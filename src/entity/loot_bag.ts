import { Field, Int, ObjectType } from 'type-graphql';
import {
  AfterLoad,
  BaseEntity,
  Column,
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
  @Field(() => Int)
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

  @Column({ nullable: false })
  raw: string;

  @AfterLoad()
  sortItems(): void {
    const sortedItems = this.raw.split('\n');
    this.items.sort((left, right) => {
      return sortedItems.indexOf(left.name) - sortedItems.indexOf(right.name);
    });
  }
}
