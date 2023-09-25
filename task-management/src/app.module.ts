import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';
import { Task } from './task/entities/task.entity';
import { Project } from './project/entities/project.entity';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost', // Redis host
      port: 6379, // Redis port
      ttl: 60, // Time-to-live for cached items (in seconds)
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'fosat',
      password: '@Fosat',
      database: 'stackbuld_assessment',
      entities: [Project, Task],
      synchronize: true,
    }),
    TaskModule,
    ProjectModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
