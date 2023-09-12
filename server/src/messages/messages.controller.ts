import { Controller, Get, Post, Param, Body, Delete, UseGuards, Req, NotAcceptableException, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
//import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import { Course } from 'src/courses/entities/course.entity';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly notificationsService: NotificationsService
    ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req, @Body() createMessageDto: CreateMessageDto): Promise<Message> {
    // validate that the user is using his id when he send the message
    if (req.authData.user.id != createMessageDto.sender.id) {
      throw new NotAcceptableException('you can not send by other one identity!.');
    }

    // check if the user is not supervisor or admin
    if (req.authData.user.userType != 'supervisor' && req.authData.user.userType != 'admin') {
      throw new NotAcceptableException('you are not allowed to send message to the course because you not one of the supervisors or an admin!.');
    }

    // check if the user is really subscribed on the course as he/she claim 
    const subscription = await this.subscriptionsService.findByUserAndCourse(
      createMessageDto.course.id,
      createMessageDto.sender.id
    );

    // if the subscribtion is found or the user is an admin then allow him to send the message
    if (subscription || req.authData.user.userType == 'admin') {
      const message = await this.messagesService.create(createMessageDto);

      //** now the notification creation steps */
      // step 1 getting this course subscribtions
      const subscriptions = await this.subscriptionsService.findByCourse(createMessageDto.course.id);
      // step 2 getting each supervisor in that course an make it one of the notification subscribers
      const notificationSubscribers: User[] = subscriptions
        .filter((subs: Subscription) => subs.user.userType == 'supervisor' && subs.user.id != createMessageDto.sender.id)
        .map((subs: Subscription) => subs.user);
      // step 3 creating the notification DTO object
      const notificationDTO: CreateNotificationDto = {
        text: `there is new message in the ${message.course.name} course from ${message.sender.username}`,
        entityId: message.course.id,
        pagePath: 'course',
        pageSection: 'ChattingRoom'
      };
      
      // step 4 create notification for this course supervisors
      const forAdminsAsWell = req.authData.user.userType == 'admin';
      await this.notificationsService.create(notificationDTO, notificationSubscribers, !forAdminsAsWell);

      // return the created message
      return message;
    } else {
      throw new NotAcceptableException('subscription not found!.');
    }
  }
  @UseGuards(AuthGuard)
  @Post('/get-user-msgs')
  async getUserMessagesBasedOn(@Request() req, @Body() info: { courseId: number}): Promise<Message[]>{
    if (req.authData.user.userType == 'admin') {
      return this.messagesService.getByCourse({ id: info.courseId } as Course);
    } else {
      const subscription: Subscription = await this.subscriptionsService.findByUserAndCourse(info.courseId, req.authData.user.id);
      if (subscription) {
        return this.messagesService.getByCourse(subscription.course);
      } else {
        return [];
      }
    }
  }

  //@UseGuards(JwtAuthGuard)
  @Get()
  async howMany(): Promise<any> {
    return {inf: 'there is '+await this.messagesService.howMany()+' messages'};
  }


  //@UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req): Promise<void> {
    const user: User = req.user;
    await this.messagesService.remove(id, user);
  }
}
