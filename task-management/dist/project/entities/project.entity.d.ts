import { Task } from 'src/task/entities/task.entity';
export declare class Project {
    id: number;
    title: string;
    description: string;
    userId: number;
    tasks: Task[];
    dueDate: Date;
}
