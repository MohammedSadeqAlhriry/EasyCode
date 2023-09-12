import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Stage } from 'src/stages/entities/stage.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isDone: boolean;

  @Column({ default: 0 })
  scores: number;

  // relations
  @ManyToOne(() => User, user => user.subscriptions)
  user: User;

  @ManyToOne(() => Course, course => course.subscriptions)
  course: Course;

  @ManyToOne(() => Stage, (stage) => stage.subscriptions)
  stage: Stage;
}