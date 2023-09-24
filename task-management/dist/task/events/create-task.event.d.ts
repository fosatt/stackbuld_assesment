export declare class CreateTaskEvent {
    readonly title: string;
    readonly description: string;
    readonly projectId: number;
    readonly userId: number;
    readonly dueDate: Date;
    constructor(title: string, description: string, projectId: number, userId: number, dueDate: Date);
}
