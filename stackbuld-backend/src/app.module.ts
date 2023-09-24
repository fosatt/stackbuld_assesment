import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 8001,
          //   urls: ['amqp://localhost:5672'],
          //   queue: 'user_queue',
        },
      },
      {
        name: 'TASK_SERVICE',
        transport: Transport.TCP,
        // options: {
        //   urls: ['amqp://localhost:5672'],
        //   queue: 'user_queue',
        // },
      },
    ]),
    // ClientsModule.register([
    //   {
    //     name: 'TASK_SERVICE',
    //     transport: Transport.TCP,
    //     // options: {
    //     //   urls: ['amqp://localhost:5672'],
    //     //   queue: 'user_queue',
    //     // },
    //   },
    // ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
