import { IsOptional } from "class-validator";
import { Course } from "src/courses/entities/course.entity";
import { Lesson } from "src/lessons/entities/lesson.entity";
import { Project } from "src/projects/entities/project.entity";
import { User } from "src/users/entities/user.entity";

export class LikeDto {
    @IsOptional()
    user: User;

    @IsOptional()
    course: Course;

    @IsOptional()
    lesson: Lesson;

    @IsOptional()
    project: Project;
}
