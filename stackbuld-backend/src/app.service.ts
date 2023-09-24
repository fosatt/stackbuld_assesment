import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserEvent } from './events/create-user.event';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = this.userClient.emit(
      'user_created',
      new CreateUserEvent(createUserDto.username),
    );
    return user;
  }
}
