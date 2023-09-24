import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
export declare class TaskService {
    private readonly userClient;
    private readonly taskRepository;
    constructor(userClient: ClientProxy, taskRepository: Repository<Task>);
    create(createTaskDto: CreateTaskDto): Promise<CreateTaskDto & Task>;
    findAll(): Promise<Task[]>;
    findOne(id: number): Promise<Task>;
    update(id: number, updateTaskDto: UpdateTaskDto): string;
    remove(id: number): string;
    handleTaskCron(): Promise<void>;
    findDueTasks(): Promise<Task[]>;
    notifyTaskDue(task: Task): Promise<void>;
}
