import { IsNotEmpty, MinLength } from "class-validator";
import { Stage } from "src/stages/entities/stage.entity";

export class CreateStageAskedProjectDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    stage: Stage;
}
