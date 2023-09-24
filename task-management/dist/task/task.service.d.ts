import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Paginator } from 'src/utils/paginator';
export declare class TaskService {
    private readonly userClient;
    private readonly taskRepository;
    private readonly paginator;
    constructor(userClient: ClientProxy, taskRepository: Repository<Task>, paginator: Paginator);
    create(createTaskDto: CreateTaskDto): Promise<CreateTaskDto & Task>;
    findAll(req_page: any, req_limit: any): Promise<{
        data: Task[];
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<Task>;
    update(id: number, updateTaskDto: UpdateTaskDto): string;
    remove(id: number): string;
    handleTaskCron(): Promise<void>;
    findDueTasks(): Promise<Task[]>;
    notifyTaskDue(task: Task): Promise<void>;
}
