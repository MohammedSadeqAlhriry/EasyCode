import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { plainToClass } from 'class-transformer';
import { Lesson } from './entities/lesson.entity';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  create(@Body() createLessonDTOs: CreateLessonDto[]) {
    //console.log(createLessonDTOs);
    let lessons: Lesson[] = new Array<Lesson>();
    createLessonDTOs.forEach((dto)=>{
      lessons.push(plainToClass(Lesson, dto));
    });
    return this.lessonsService.create(lessons);
  }

  @Get()
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDTOs: UpdateLessonDto[]) {
    let lessons: Lesson[] = new Lesson[updateLessonDTOs.length];
    updateLessonDTOs.forEach((dto)=>{
      lessons.push(plainToClass(Lesson, dto));
    });
    return this.lessonsService.update(lessons);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(+id);
  }

  @Delete('/all-in-stage/:id')
  removeAllLessonsUnderThisStageId(@Param('id') id: string) {
    return this.lessonsService.removeStageLessons(+id);
  }
}
