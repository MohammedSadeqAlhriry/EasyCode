import { IsNotEmpty, IsString } from 'class-validator';
import { Stage } from 'src/stages/entities/stage.entity';

export class CreateExamDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsString()
  answer: string;

  @IsNotEmpty()
  @IsString()
  rightAnswer: string;

  @IsNotEmpty()
  stage: Stage;
}