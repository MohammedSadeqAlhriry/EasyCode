import { IsDate, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { Course } from 'src/courses/entities/course.entity';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateCommentDTO {
  @IsNotEmpty()
  textContent: string;

  @IsDate()
  createdDate: Date;

  @IsObject()
  user: User;

  @IsOptional()
  course: Course;

  @IsOptional()
  project: Project;
}