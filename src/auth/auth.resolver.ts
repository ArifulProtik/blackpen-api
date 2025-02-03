import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'src/decorators/auth.decorator';
import {
  SigninInput,
  SigninResponse,
  SignupInput,
} from 'src/models/auth.model';
import { BaseModel } from 'src/models/base.model';
import { User } from 'src/models/user.model';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private auth: AuthService) {}
  @Public()
  @Mutation(() => User)
  async Signup(@Args('signupInput') signupInput: SignupInput): Promise<User> {
    const user = await this.auth.signUp(signupInput);
    return user;
  }
  @Public()
  @Mutation(() => SigninResponse)
  async Signin(
    @Args('signinInput') signinInput: SigninInput,
  ): Promise<SigninResponse> {
    const { user, token } = await this.auth.signIn(signinInput);
    return { user, token };
  }
  @Public()
  @Mutation(() => BaseModel)
  async Signout(@Context() ctx: any): Promise<BaseModel> {
    const token = ctx.req.headers.authorization.split(' ')[1];
    if (!token) {
      return { status: 'error', message: 'Token Missing' };
    }
    await this.auth.signOut(token);
    return { status: 'sucess', message: 'Signout' };
  }
}
