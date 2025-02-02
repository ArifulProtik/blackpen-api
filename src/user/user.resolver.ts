import { Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/models/user.model';

@Resolver()
export class UserResolver {
  @Query(() => User)
  async getUser() {
    return {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      username: 'JhonDOe',
      password: 'password123',
    };
  }
}
