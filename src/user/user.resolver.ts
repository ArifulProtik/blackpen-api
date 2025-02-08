import { NotFoundException } from '@nestjs/common';
import { Context, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/models/user.model';
import { User as dbUser } from '@prisma/client';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private userservice: UserService) {}
  @Query(() => User)
  async me(@Context() ctx: any) {
    const user: dbUser = ctx.req.user;
    return await this.userservice.getUserByid(user.id);
  }
}
