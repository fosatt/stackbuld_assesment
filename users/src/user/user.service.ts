import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcryptjs';
import { ClientProxy } from '@nestjs/microservices';
import { Client, LibraryResponse, SendEmailV3_1 } from 'node-mailjet';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject('TASK_SERVICE')
    private readonly taskClient: ClientProxy,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.save(createUserDto);
    console.log('This action adds a new user');
    return user;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  public async signup(data: CreateUserDto) {
    const { username, email, firstname, lastname } = data;
    const hashedPassword = await hash(data.password, 10);
    const checkUser = await this.getByEmail(email);
    if (checkUser) {
      throw new HttpException('USER_EXISTS', HttpStatus.CONFLICT);
    }
    // newUser.role = Role.USER;
    const user = await this.userRepository.save({
      username,
      email,
      firstname,
      lastname,
      password: hashedPassword,
    });
    // const createTokenResponse = await firstValueFrom(
    //   this.tokenClient.send('token_create', JSON.stringify(user)),
    // );
    // user.password = undefined;
    return user;
  }
  public async getAuthenticatedUser(username: string, password: string) {
    try {
      const user = await this.getByEmail(username);
      await this.verifyPassword(password, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async sendMailMessage(task, user, project): Promise<any> {
    const mailjet = new Client({
      apiKey: process.env.MAILJET_PUBLIC_KEY,
      apiSecret: process.env.MAILJET_SECRET_KEY,
    });
    const data: SendEmailV3_1.Body = {
      Messages: [
        {
          From: {
            Email: 'falodunseyit@gmail.com',
          },
          To: [
            {
              Email: user.email,
            },
          ],
          Subject: `Task Assignment - ${task.title}`,
          HTMLPart:
            `<h3>Dear ${user?.username} </h3> <br />` +
            `I hope this message finds you well. We are excited to inform you that you have been assigned a new task. Details of the task are provided below:<br /> <br />` +
            `Task Title:  ${task.title} <br />
            Project Name:  ${project?.title} <br />
            Due Date:  ${task.dueDate} <br />
            
            Task Description: 
            ${task.description}`,
          TextPart:
            'Dear passenger, welcome to Mailjet! May the delivery force be with you!',
        },
      ],
    };
    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
      .post('send', { version: 'v3.1' })
      .request(data);
    const { Status } = result.body.Messages[0];
    return Status;
  }

  async handleTaskNotification(task) {
    //  get user information
    const user = await this.findOne(task.userId);
    // get project information
    const project = await this.taskClient
      .send('findProjectById', task.projectId)
      .toPromise();
    console.log(project);
    if (project && user) {
      const response = await this.sendMailMessage(task, user, project);
      return response;
    } else {
      return;
    }
    return null;
  }
}
