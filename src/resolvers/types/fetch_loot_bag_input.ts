import { Field, InputType, Int } from 'type-graphql';

@InputType()
export default class FetchLootBagInput {
  @Field(() => Int)
  id: number;
}
