// import { User } from 'src/user/entities/user.entity';
import { Project } from 'src/project/entities/project.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  userId: number;

  @Column({
    nullable: true,
    default: 'pending',
    enum: ['pending', 'complete', 'overdue'],
  })
  status: string;

  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ nullable: true })
  projectId: number;

  @Column({ type: 'timestamp', default: new Date() })
  dueDate: Date;

  @Column({ name: 'created_at', type: 'timestamp', default: new Date() })
  createdAt: Date;
}
