import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { GraphQLError } from 'graphql';
import { USERNAME } from 'src/constants/const';
import { GRAPHQL_ERROR_CODES } from 'src/constants/error.code';
import {
  JWTPayload,
  SigninInput,
  SigninResponse,
  SignupInput,
} from 'src/models/auth.model';
import { BaseModel } from 'src/models/base.model';
import { User } from 'src/models/user.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signIn(credentials: SigninInput): Promise<SigninResponse> {
    try {
      const { email, password } = credentials;
      const user = await this.getUserByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const isValidPass = await this.verifyPassword(password, user.password);
      if (!isValidPass) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload: JWTPayload = {
        sub: user.id,
      };
      const token = await this.jwt.signAsync(payload);
      const session = await this.prisma.session.create({
        data: {
          token,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return {
        token,
        user,
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async signUp(credentials: SignupInput) {
    const { name, email, password } = credentials;

    try {
      const hashedPassword = await this.hashPassword(password);

      return await this.prisma.user.create({
        data: {
          name,
          email,
          username: this.generateRandomUsernaem(),
          password: hashedPassword,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new GraphQLError('Email already exists', {
            extensions: {
              code: GRAPHQL_ERROR_CODES.BAD_USER_INPUT,
              invalidArgs: ['email'],
            },
          });
        }
      }
      throw new GraphQLError('Something went wrong', {
        extensions: {
          code: GRAPHQL_ERROR_CODES.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }
  async signOut(token: string): Promise<BaseModel> {
    try {
      await this.prisma.session.delete({
        where: { token },
      });
      return {
        status: 'sucess',
        message: 'Signed out successfully',
      };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new ForbiddenException('Invalid token');
        }
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async hashPassword(plain: string): Promise<string> {
    return await argon.hash(plain);
  }

  async verifyPassword(plain: string, hash: string): Promise<boolean> {
    return await argon.verify(hash, plain);
  }

  // Reddit like Username Generation
  generateRandomUsernaem(): string {
    // TODO: Move this to a constant

    // Pick random adjective and noun
    const adjective =
      USERNAME.ADJECTIVE[Math.floor(Math.random() * USERNAME.ADJECTIVE.length)];
    const noun =
      USERNAME.NOUN[Math.floor(Math.random() * USERNAME.NOUN.length)];

    // Append a random number (e.g., between 1000 and 9999) to reduce the chances of duplication.
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;

    return `${adjective}${noun}${randomNumber}`;
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async ValidateSession(token: string): Promise<User> {
    try {
      const payload = await this.jwt.verifyAsync<JWTPayload>(token);
      const session = await this.prisma.session.findFirst({
        where: {
          token,
        },
        include: {
          user: true,
        },
      });
      return session.user;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid auth token');
    }
  }
}
