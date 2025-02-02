import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'user' })
export class User {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  username: string;
}
