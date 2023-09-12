import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, IsNull } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isDeleted: boolean;

  @Column()
  textContent: string;

  @Column()
  DateAndTime: Date;

  @ManyToOne(() => User, user => user.messages)
  sender: User;

  @ManyToOne(() => Course, course => course.messages)
  course: Course;
}