import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';
import { Course } from 'src/courses/entities/course.entity';

export class CreateStageDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsBoolean()
  hasProject: boolean;

  @IsNotEmpty()
  course: Course;
}