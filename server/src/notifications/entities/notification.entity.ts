import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from './status.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pagePath: string;

  @Column()
  pageSection: string;

  @Column()
  text: string;

  @Column()
  entityId: number;

  // relations

  @OneToMany(() => Status, notification => notification.notification)
  statuses: Status[];
}
