import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ProjectService } from 'src/project/project.service';
export declare class TaskController {
    private readonly taskService;
    private readonly projectService;
    constructor(taskService: TaskService, projectService: ProjectService);
    create(createTaskDto: CreateTaskDto): Promise<CreateTaskDto & import("./entities/task.entity").Task>;
    findAll(): Promise<import("./entities/task.entity").Task[]>;
    findOne(id: string): Promise<import("./entities/task.entity").Task>;
    update(id: string, updateTaskDto: UpdateTaskDto): string;
    remove(id: string): string;
}
