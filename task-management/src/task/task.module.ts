import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Project } from 'src/project/entities/project.entity';
import { Task } from './entities/task.entity';
import { ProjectService } from 'src/project/project.service';
import { Paginator } from 'src/utils/paginator';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Task]),
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
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [TaskController],
  providers: [TaskService, ProjectService, Paginator],
})
export class TaskModule {}
