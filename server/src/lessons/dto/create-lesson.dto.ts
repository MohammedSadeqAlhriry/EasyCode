import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import { Stage } from "src/stages/entities/stage.entity";

export class CreateLessonDto {
    @IsString()
    @MinLength(15)
    url: string;

    @IsNotEmpty()
    stage: Stage;
}
