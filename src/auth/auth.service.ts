import { Injectable } from '@nestjs/common';
import { SignupInput } from 'src/models/auth.model';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { User } from 'src/models/user.model';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { GraphQLError } from 'graphql';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
              code: 'BAD_USER_INPUT',
              invalidArgs: ['email'],
            },
          });
        }
      }
      console.log(err);
      throw new GraphQLError('Something went wrong', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
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
    const adjectives = [
      'cool',
      'happy',
      'fuzzy',
      'brave',
      'smart',
      'funny',
      'crazy',
      'silly',
      'witty',
      'clever',
      'kind',
      'gentle',
      'calm',
      'quiet',
    ];
    const nouns = [
      'cat',
      'dog',
      'tiger',
      'lion',
      'panda',
      'bear',
      'wolf',
      'fox',
      'rabbit',
      'mouse',
      'squirrel',
      'hamster',
      'guinea pig',
      'hedgehog',
      'ferret',
      'chinchilla',
      'gerbil',
      'rabbit',
      'mouse',
      'squirrel',
      'hamster',
      'guinea pig',
      'hedgehog',
      'ferret',
      'chinchilla',
      'gerbil',
      'rabbit',
      'mouse',
      'squirrel',
      'hamster',
      'guinea pig',
      'hedgehog',
      'ferret',
      'chinchilla',
      'gerbil',
      'rabbit',
      'mouse',
      'squirrel',
      'hamster',
      'guinea pig',
      'hedgehog',
      'ferret',
      'chinchilla',
      'gerbil',
      'rabbit',
      'mouse',
      'squirrel',
      'hamster',
      'guinea pig',
      'hedgehog',
      'ferret',
      'chinchilla',
      'gerbil',
      'rabbit',
      'mouse',
      'squirrel',
      'hamster',
      'guinea pig',
      'hedgehog',
      'ferret',
      'chinchilla',
      'gerbil',
      'rabbit',
      'mouse',
      'squirrel',
      'hamster',
      'guinea pig',
      'hedgehog',
      'ferret',
      'chinchilla',
      'gerbil',
      'rabbit',
      'mouse',
      'squirrel',
      'hamster',
      'guinea pig',
      'hedgehog',
      'ferret',
      'chinchilla',
      'gerbil',
      'rabbit',
      'mouse',
      'squirrel',
      'hamster',
      'guinea pig',
      'hedgehog',
      'ferret',
      'chinchilla',
      'gerbil',
      'rabbit',
      'mouse',
      'squirrel',
      'hamster',
      'guinea pig',
      'hedgehog',
      'ferret',
      'chinchilla',
      'gerbil',
      'rabbit',
      'mouse',
      'squirrel',
      'hamster',
      'guinea pig',
      'hedgehog',
      'ferret',
      'chinchilla',
      'gerbil',
      'rabbit',
      'mouse',
      'squirrel',
      'hamster',
      'guinea pig',
      'hedgehog',
      'ferret',
      'chinchilla',
      'gerbil',
      'rabbit',
      'mouse',
      'squirrel',
    ];

    // Pick random adjective and noun
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    // Append a random number (e.g., between 1000 and 9999) to reduce the chances of duplication.
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;

    return `${adjective}${noun}${randomNumber}`;
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
