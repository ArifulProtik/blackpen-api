import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Graphql Server Up and Running at /graphql',
    };
  }
}
