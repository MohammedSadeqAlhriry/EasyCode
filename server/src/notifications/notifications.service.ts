import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './entities/status.entity';
import { plainToClass } from 'class-transformer';
import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entities/user.entity';
import { subscribe } from 'diagnostics_channel';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(Status)
    private readonly statusesRepository: Repository<Status>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  
  /**
   * 1 - passing two parameters to the function will create the notification for specific users
   * 
   * 2 - passing only the notification DTO object will create the notification for all the users in the system
   * 
   * 3 - passing the forAdminsAsWell = true will create the notification for admins as well
   * 
   * !!!!(I want you to know that this is not the efficient way to create notification instead you need to create background task).
   *  **/
  async create(createNotificationDto: CreateNotificationDto, subscribers?: User[], forAdminsAsWell: boolean = false): Promise<Notification> {
    // first lets change the notification from DTO to entity
    const newNotification = plainToClass(Notification, createNotificationDto);
    // then lets create it
    const savedNotification = await this.notificationsRepository.save(newNotification);
    // the next steps is to assigning subscribers to this notifications in order to know who will recieve it.
    // as well as the status will allow us to know if the subscriber has read it or not
    const statuses: Status[] = new Array();
    if (subscribers) {
      // get the admin as well
      if (forAdminsAsWell) {
        (await this.usersRepository.find({ where: { userType: 'admin' }})).forEach((admin: User) => {
          statuses.push({
            user: admin,
            notification: savedNotification,
          } as Status);
        });
      }
      subscribers.forEach((subscriber: {id: number}) => statuses.push({
        user: subscriber,
        notification: savedNotification,
      } as Status));
    } else {
      (await this.usersRepository.find({})).forEach((user: User) => {
        statuses.push({
          user: user,
          notification: savedNotification,
        } as Status);
      });
    }
    
    // save the statuses in the database
    await this.statusesRepository.save(statuses);
    // return the notification with the statuses that are connected to it
    return await this.findOne(savedNotification.id);
  }

  async declaringNotificationsHaveBeenViewedForThisUser(userId: number): Promise<void> {
    const updatedStatuses: Status[] = (await this.statusesRepository.find({
      where: { user: { id: userId }}
    })).map(status => ({ ...status, viewed: true }));
    await this.statusesRepository.save(updatedStatuses);
  }

  async findAll(): Promise<Notification[]> {
    return await this.notificationsRepository.find({
      relations: ['statuses']
    });
  }

  async findOne(id: number): Promise<Notification> {
    return await this.notificationsRepository.findOne({
      where: { id: id},
      relations: ['statuses']
    });
  }

  async getUsersNotifications(userId: number): Promise<Notification[]> {
    const userNotificationsCollection: Notification[] = (await this.statusesRepository.find({
      where: { user: { id: userId }, viewed: false },
      relations: ['notification']
    })).map(status => status.notification);
    //console.log(`user id: ${userId} and the user get ${userNotificationsCollection.length} notifications`);
    return userNotificationsCollection;
  }


  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
