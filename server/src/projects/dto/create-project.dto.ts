import { IsNotEmpty } from "class-validator";
import { Course } from "src/courses/entities/course.entity";
import { StageAskedProject } from "src/stage-asked-project/entities/stage-asked-project.entity";
import { User } from "src/users/entities/user.entity";

export class CreateProjectDto {

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  askedProject: StageAskedProject

  @IsNotEmpty()
  student: User;

  @IsNotEmpty()
  course: Course;
}
