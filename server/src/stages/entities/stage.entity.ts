import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Exam } from 'src/exams/entities/exam.entity';
import { StageAskedProject } from 'src/stage-asked-project/entities/stage-asked-project.entity';

@Entity()
export class Stage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  hasProject: boolean;

  // relations
  @ManyToOne(() => Course, (course) => course.stages)
  course: Course;

  @OneToMany(() => Subscription, subscription => subscription.stage)
  subscriptions: Subscription[];

  @OneToMany(() => Lesson, lesson => lesson.stage)
  lessons: Lesson[];

  @OneToMany(() => Exam, exam => exam.stage)
  exams: Exam[];

  @OneToMany(() => StageAskedProject, stageAskedProject => stageAskedProject.stage)
  stageAskedProjects: StageAskedProject[];
}