import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// user made
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { BcryptService } from 'src/auth/bcrypt.service';
import { ConfirmationsModule } from 'src/confirmations/confirmations.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    NotificationsModule,
    ConfirmationsModule,
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, BcryptService],
  exports: [UsersService]
})
export class UsersModule {}
