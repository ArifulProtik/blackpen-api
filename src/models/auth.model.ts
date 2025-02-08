import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Match } from './decorators';
import { User } from './user.model';

@InputType()
export class SignupInput {
  @Field()
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  name: string;
  @Field()
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;
  @Field()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
  @Field()
  @MinLength(6, {
    message: 'Confirm password must be at least 6 characters long',
  })
  @IsString({ message: 'Confirm password must be a string' })
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}

@InputType()
export class SigninInput {
  @Field()
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;
  @Field()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

@ObjectType({ description: 'Signin Response' })
export class SigninResponse {
  @Field()
  token: string;
  @Field()
  user: User;
}

export type JWTPayload = {
  sub: string;
};
