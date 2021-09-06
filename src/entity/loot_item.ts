import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ILootItem } from './interfaces/loot_item_interface';

@ObjectType()
@Entity()
export class LootItem extends BaseEntity implements ILootItem {
  @Field((_type) => ID)
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Field()
  @CreateDateColumn()
  readonly created: Date;

  @Field()
  @Column({ unique: true })
  name: string;
}
