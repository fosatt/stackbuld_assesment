import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Cron } from '@nestjs/schedule';
import { Paginator } from 'src/utils/paginator';

@Injectable()
export class TaskService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userClient: ClientProxy,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly paginator: Paginator,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const task = await this.taskRepository.save(createTaskDto);
    this.userClient.send('sendNotification', task).toPromise();
    return task;
  }

  async findAll(req_page, req_limit) {
    console.log(req_page);
    const page = Number(req_page) || 1;
    const limit = Number(req_limit) || 10;

    const builder = this.taskRepository
      .createQueryBuilder('task')
      .orderBy('created_at', 'DESC');
    const paginatedQuery = this.paginator.paginator(builder, page, limit);
    const items = await paginatedQuery.getMany();

    return {
      data: items,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
    });
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    console.log(updateTaskDto);
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
  @Cron('0 * * * * *')
  async handleTaskCron() {
    const dueTasks = await this.findDueTasks();
    // Send notifications for due tasks
    for (const task of dueTasks) {
      await this.notifyTaskDue(task);
    }
  }
  async findDueTasks(): Promise<Task[]> {
    // Implement logic to retrieve due tasks (e.g., tasks with dueDate <= current date)
    const currentDate = new Date();
    const status = 'pending';
    return this.taskRepository
      .createQueryBuilder('task')
      .where('task.dueDate <= :currentDate', { currentDate })
      .andWhere('task.status = :status', { status })
      .getMany();
  }

  async notifyTaskDue(task: Task) {
    const currentDate = new Date();
    const dueDate = new Date(task.dueDate); // getting task.dueDate field in the entity

    // Calculate the time difference between the due date and the current date
    const timeDifference = dueDate.getTime() - currentDate.getTime();

    // Define a threshold for when a task is considered "due" (e.g., 24 hours)
    const dueThresholdMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // The task is due or overdue
    if (timeDifference <= dueThresholdMilliseconds) {
      // send a notification or take other actions as needed
      await this.userClient.send<any>('sendNotification', task).toPromise();
      // Update the task's status to "overdue"
      task.status = 'overdue';
      await this.taskRepository.save(task);
    }
  }
}
