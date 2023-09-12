import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, HttpException, HttpStatus, Put, BadRequestException, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import * as fs from 'fs';


// coder made
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createUserDtoToUserEntity, updateUserDtoToUserEntity } from './mappers/user.mappers';
import { UploadFileToDiskStorage } from 'src/helpers/upload-file'
import { ConfirmationsService } from 'src/confirmations/confirmations.service';
import { CreateConfirmationDto } from 'src/confirmations/dto/create-confirmation.dto';
import { Confirmation } from 'src/confirmations/entities/confirmation.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly confirmationsService: ConfirmationsService,
    private readonly notificationsService: NotificationsService
    ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 2, UploadFileToDiskStorage),
  )
  async create(@Body() createUserDto: CreateUserDto, @UploadedFiles() files: Multer.File[]): Promise<any> {
    // first lets extract the files
    const [photo, certificationsDocs] = files;

    // then set user's photo path
    createUserDto.picturePath = photo ? `/uploads/${photo.filename}` : '/path/to/default/photo';

    // converting createUsetDto object to User object type
    const user = createUserDtoToUserEntity(createUserDto);
    
    // creating new datatype to use it inside this function
    type UserWithTokens = {
      user: User;
      tokens: string;
    };
    
    // start the user account creation operation
    try {

      //* create user, generate his/her tokens and put them inside one object of type UserWithTokens.
      const userWithTokens: UserWithTokens = {
        user: await this.usersService.create(user),
        tokens: await this.authService.getUserTokens(user)
      };

      // create new confirmation entity and link it with this new user, if the new user type is supervisor
      if (userWithTokens.user.userType == 'supervisor') {
        // get the admin to be the default reviewer for this new supervisor's certification documents
        const admins = await this.usersService.findAllByType('admin');

        // create confirmation dto object for the validation process with default values
        const confirmation: CreateConfirmationDto = {
          isConfirmed: false, // set it by default on false until the reviewer change it
          reviewerComment: 'Wait for confirmation or refuse.', // in case the reviewer didn't have the time to comment
          supervisor: userWithTokens.user,// the new supervisor
          reviewer: admins[0],// the default reviewer
          certificationsDocsPath: certificationsDocs ? `/uploads/${certificationsDocs.filename}` : '',// certification docs path
        };

        //* create the confirmation object for this new supervisor
        await this.confirmationsService.create(confirmation);
        userWithTokens.user = await this.usersService.findOneById_WithTheNecessaryRelations(userWithTokens.user.id);
      }

      // create the notification DTO object
      const notificationContent: CreateNotificationDto = {
        text: `new user hass join ${userWithTokens.user.fullName}`,
        entityId: userWithTokens.user.id,
        pagePath: 'users',
        pageSection: user.userType  
      };
      // creating the notification for each user in the system
      this.notificationsService.create(notificationContent);

      // everything is done just return the result
      return userWithTokens;

    } catch (err) {
      // if there is an error but the photo file has been already sended which mean It has been stored
      if (photo) {
        try {
          // inside try because we are deeling with files remove the photo from our disk
          fs.unlinkSync(photo.path);

          // if there is certification file, then delete them as well
          if (certificationsDocs) {
            fs.unlinkSync(certificationsDocs.path);
          }
          //console.log('File deleted successfully');
        } catch (error) {
          // inform the developer that error is accurred when we try to delete the files
          //console.log('the delete opertion faild, Details:'+error);
        }
      }
      throw err;
    }
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('supervisors')
  async getSupervisors(): Promise<User[]> {
    return await this.usersService.findAllByType('supervisor');
  }

  @Get('students')
  async getStudents(): Promise<User[]> {
    return await this.usersService.findAllByType('student');
  }

  
  @Get(':id')
  async findOne(@Param() params): Promise<User> {
    return await this.usersService.findOne(params.id);
  }

  
  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('files', 2, UploadFileToDiskStorage),
  )
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @UploadedFiles() files: Multer.File[]): Promise<any> {
    // first lets extract the files
    let [photo, certificationsDocs] = [null,null];
    if (updateUserDto.isCertificationsDocsChanged && updateUserDto.isPhotoChanged) {
      [photo, certificationsDocs] = files;
    } else if (updateUserDto.isCertificationsDocsChanged) {
      certificationsDocs = files[0];
    } else if (updateUserDto.isPhotoChanged) {
      photo = files[0];
    }

    // then getting the user entity from the db and update it
    const existUser = await this.usersService.findOne(+id)
    const user: User = updateUserDtoToUserEntity(updateUserDto, existUser);
    //remove the olds files if there any are new
    if (photo) {
      try { fs.unlinkSync(`/public${user.picturePath}`); } catch (error) { console.log(error)}
      // then update user's photo path
      user.picturePath = `/uploads/${photo.filename}`;
    }
    // update user
    user.id = +id;
    const updatedUser = await this.usersService.update(user);
    // update user confirmation if it is supervisor
    if (updateUserDto.userType == 'supervisor' && certificationsDocs) {
      try { fs.unlinkSync(`/public${updatedUser.supervisorConfirmation[0].certificationsDocsPath}`); } catch (error) { console.log(error)}
      const confirmation = new Confirmation();
      confirmation.certificationsDocsPath = `/uploads/${certificationsDocs.filename}`;
      updatedUser.supervisorConfirmation[0] = this.confirmationsService.update(updatedUser.supervisorConfirmation[0].id,confirmation);
    }
    // create new type as we do in create function
    type UserWithTokens = {
      user: User;
      tokens: string;
    };
    // create an object from this new type to be returned
    const updatedUserWithNewTokens: UserWithTokens = {
      user: updatedUser,
      tokens: await this.authService.getUserTokens(updatedUser)
    };
    return updatedUser;
  }

  
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(+id);
  }
}