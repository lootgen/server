import { ILootItem } from './loot_item_interface';

export interface ILootBag {
  readonly id: number;
  readonly created: Date;
  items: ILootItem[];
}
