import { Like } from 'src/likes/entities/like.entity';
import { Message } from 'src/messages/entities/message.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Confirmation } from 'src/confirmations/entities/confirmation.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Status } from 'src/notifications/entities/status.entity';

@Entity()
@Unique(['email', 'username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;
  
  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  userType: string;

  @Column()
  userDescription: string;

  @Column()
  picturePath: string;

  @Column()
  signupDate: Date;

  @Column()
  birthDate: Date;

  @Column()
  address: string;

  @Column({ nullable: true })
  currentCourseId: string;

  @Column({ default: false })
  isDeleted: boolean;

  // realtions
  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Subscription, subscribe => subscribe.user)
  subscriptions: Subscription[];

  @OneToMany(() => Message, message => message.sender)
  messages: Message[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(() => Confirmation, confirmation => confirmation.supervisor)
  supervisorConfirmation: Confirmation;

  @OneToMany(() => Confirmation, confirmation => confirmation.reviewer)
  reviewerConfirmations: Confirmation[];

  @OneToMany(() => Project, project => project.student)
  projects: Project[];

  @OneToMany(() => Course, course => course.courseAdmin)
  courses: Course[];

  @OneToMany(() => Status, notification => notification.user)
  notifications: Status[];
}
