import { Field, ID, InputType } from 'type-graphql';

@InputType()
export default class FetchItemInput {
  @Field((_type) => ID)
  id: string;
}
