import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Project } from 'src/project/entities/project.entity';
import { Task } from './entities/task.entity';
import { ProjectService } from 'src/project/project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Task]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'users_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [TaskController],
  providers: [TaskService, ProjectService],
})
export class TaskModule {}
