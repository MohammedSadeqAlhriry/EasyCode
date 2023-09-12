import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() category: Category): Promise<Category> {
    try {
      return await this.categoriesService.create(category);
    } catch (error) {
      if (error.number == '2627') { // 2627 sql error for duplicate value
        throw new HttpException(`Category with name '${category.name}' already exists.`, HttpStatus.CONFLICT);
      }
      throw new HttpException(`Internal server error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    const category = await this.categoriesService.findOne(+id);
    if (!category) {
      throw new HttpException(`Category with ID '${id}' not found.`, HttpStatus.NOT_FOUND);
    }
    return category;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() category: Category): Promise<Category> {
    try {
      return await this.categoriesService.update(+id, category);
    } catch (error) {
      if (error.number == '2627') { // 2627 sql error for duplicate value
        throw new HttpException(`Category with name '${category.name}' already exists.`, HttpStatus.CONFLICT);
      }
      throw new HttpException(`Internal server error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.categoriesService.remove(+id);
  }
}