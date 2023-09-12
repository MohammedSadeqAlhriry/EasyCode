import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateMessageDto {

  @IsOptional()
  @IsBoolean()
  isDeleted: boolean;

  @IsNotEmpty()
  @IsString()
  textContent: string;

  @IsOptional()
  @IsNotEmpty()
  DateAndTime: Date;

  @IsNotEmpty()
  sender: User;

  @IsNotEmpty()
  course: Course;
}