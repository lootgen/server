import {
  ArrayMaxSize,
  ArrayMinSize,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Field, InputType } from 'type-graphql';

@ValidatorConstraint()
export class LootItemsValidator implements ValidatorConstraintInterface {
  public async validate(items: string[]): Promise<boolean> {
    return items.findIndex((item) => item.trim().length === 0) === -1;
  }
}

@InputType()
export default class CreateLootBagInput {
  @Field((_type) => [String], { nullable: false })
  @ArrayMinSize(8)
  @ArrayMaxSize(8)
  @Validate(LootItemsValidator, { message: 'Loot items cannot be empty.' })
  items: string[];
}
