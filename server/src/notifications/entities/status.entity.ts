import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Notification } from './notification.entity';

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: false})
  viewed: boolean;

  // relations

  @ManyToOne(() => User, user => user.notifications)
  user: User;

  @ManyToOne(() => Notification, notification => notification.statuses)
  notification: Notification;
}