"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./entities/task.entity");
const schedule_1 = require("@nestjs/schedule");
const paginator_1 = require("../utils/paginator");
let TaskService = class TaskService {
    constructor(userClient, taskRepository, paginator) {
        this.userClient = userClient;
        this.taskRepository = taskRepository;
        this.paginator = paginator;
    }
    async create(createTaskDto) {
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
    async findOne(id) {
        const task = await this.taskRepository.findOne({
            where: { id },
        });
        return task;
    }
    update(id, updateTaskDto) {
        console.log(updateTaskDto);
        return `This action updates a #${id} task`;
    }
    remove(id) {
        return `This action removes a #${id} task`;
    }
    async handleTaskCron() {
        const dueTasks = await this.findDueTasks();
        for (const task of dueTasks) {
            await this.notifyTaskDue(task);
        }
    }
    async findDueTasks() {
        const currentDate = new Date();
        const status = 'pending';
        return this.taskRepository
            .createQueryBuilder('task')
            .where('task.dueDate <= :currentDate', { currentDate })
            .andWhere('task.status = :status', { status })
            .getMany();
    }
    async notifyTaskDue(task) {
        const currentDate = new Date();
        const dueDate = new Date(task.dueDate);
        const timeDifference = dueDate.getTime() - currentDate.getTime();
        const dueThresholdMilliseconds = 24 * 60 * 60 * 1000;
        if (timeDifference <= dueThresholdMilliseconds) {
            await this.userClient.send('sendNotification', task).toPromise();
            task.status = 'overdue';
            await this.taskRepository.save(task);
        }
    }
};
exports.TaskService = TaskService;
__decorate([
    (0, schedule_1.Cron)('0 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaskService.prototype, "handleTaskCron", null);
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('USER_SERVICE')),
    __param(1, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [microservices_1.ClientProxy,
        typeorm_2.Repository,
        paginator_1.Paginator])
], TaskService);
//# sourceMappingURL=task.service.js.map