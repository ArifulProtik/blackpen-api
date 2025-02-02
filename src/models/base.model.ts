import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseModel {
  @Field()
  status: 'sucess' | 'error';
  @Field()
  message: string;
  @Field({ nullable: true })
  data?: any;
}
