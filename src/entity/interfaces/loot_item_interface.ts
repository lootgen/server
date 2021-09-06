import { IItem } from './item_interface';
import { ILootBag } from './loot_bag_interface';

export interface ILootItem {
  readonly id: string;
  item: IItem;
  bag: ILootBag;
  order: number;
}
