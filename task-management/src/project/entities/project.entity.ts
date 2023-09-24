import { Task } from 'src/task/entities/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  userId: number;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @Column({ type: 'timestamp', default: new Date() })
  dueDate: Date;
}
