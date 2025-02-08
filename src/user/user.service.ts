import { Injectable, NotFoundException } from '@nestjs/common';
import { ADDRGETNETWORKPARAMS } from 'dns';
import { User } from 'src/models/user.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserByid(id: string): Promise<User> {
    try {
      return await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });
    } catch {
      throw new NotFoundException('User Not Found');
    }
  }
}
