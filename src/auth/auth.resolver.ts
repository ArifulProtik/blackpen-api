import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignupInput } from 'src/models/auth.model';
import { User } from 'src/models/user.model';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private auth: AuthService) {}
  @Mutation(() => User)
  async Signup(@Args('signupInput') signinInput: SignupInput): Promise<User> {
    const user = await this.auth.signUp(signinInput);
    return user;
  }
}
