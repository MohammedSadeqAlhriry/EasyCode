import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { User } from '../../users/entities/user.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Project } from 'src/projects/entities/project.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @ManyToOne(() => Course, (course) => course.likes)
  course: Course;

  @ManyToOne(() => Lesson, (lesson) => lesson.likes)
  lesson: Lesson;

  @ManyToOne(() => Project, (project) => project.likes)
  project: Project;
}