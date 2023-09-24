import { Project } from 'src/project/entities/project.entity';
export declare class Task {
    id: number;
    title: string;
    description: string;
    userId: number;
    status: string;
    project: Project;
    projectId: number;
    dueDate: Date;
    createdAt: Date;
}
