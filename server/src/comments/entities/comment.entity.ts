import { Course } from 'src/courses/entities/course.entity';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  textContent: string;

  @Column()
  createdDate: Date;

  // relations
  @ManyToOne(() => User, user => user.comments)
  user: User;

  @ManyToOne(() => Course, course => course.comments)
  course: Course;

  @ManyToOne(() => Project, project => project.comments)
  project: Project;
}