import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post(':userId')
  async create(@Param('userId') userId: string) {
    const userNotifications = await this.notificationsService.getUsersNotifications(+userId);
  }

  @Post('/declaringNotificationsHaveBeenViewed/:userId')
  async declaringNotificationsHaveBeenViewed(@Param('userId') userId: string) {
    return await this.notificationsService.declaringNotificationsHaveBeenViewedForThisUser(+userId);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return await this.notificationsService.getUsersNotifications(+userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
