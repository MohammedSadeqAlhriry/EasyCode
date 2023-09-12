import { IsNotEmpty, IsString } from 'class-validator';
import { Category } from '../../categories/entities/category.entity';

export class CreateCourseDto {
  @IsNotEmpty()
  imagePath: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  category: Category;
}