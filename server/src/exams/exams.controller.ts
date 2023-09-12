import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, UseGuards, Request } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { Exam } from './entities/exam.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { CoursesService } from 'src/courses/courses.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('exams')
export class ExamsController {
  constructor(
    private readonly examsService: ExamsService,
    private readonly subsServices: SubscriptionsService,
    private readonly coursesServices: CoursesService) {}

  // accessed by course supervisor 
  @Post()
  async create(@Body() createExamDto: CreateExamDto): Promise<Exam> {
    return this.examsService.create(createExamDto);
  }

  @Get()
  async findAll(): Promise<Exam[]> {
    return this.examsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Exam> {
    const exam = await this.examsService.findOne(id);
    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }
    return exam;
  }

  // accessed by course supervisor 
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateExamDto: UpdateExamDto): Promise<Exam> {
    return this.examsService.update(id, updateExamDto);
  }

  // accessed by course supervisor
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.examsService.remove(id);
  }

  @Delete('/all-in-stage/:id')
  async removeAllExamsUnderThisStageId(@Param('id') id: string) {
    await this.examsService.removeStageExams(+id);
  }

  @Get('/stage/:stageId')
  async findByStage(@Param('stageId') stageId: number): Promise<Exam[]> {
    return this.examsService.findByStage(stageId);
  }

  @UseGuards(AuthGuard)
  @Post('/calculate-result/:stageId')
  async calculateResult(@Param('stageId') stageId: number, 
                        @Body() data: { courseId: number, examAnswers: { examId: number, answer: string }[]},
                        @Request() req): Promise<any> {
    const result = await this.examsService.calculateResult(stageId, data.examAnswers);
    let sub = await this.subsServices.findByUserAndCourse(data.courseId,req.authData.user.id);
    if (result >= 5 && !sub.isDone && sub.stage.id == stageId) {
      const course = await this.coursesServices.findOne(data.courseId);
      var stageIndex = 0;
      course.stages.forEach((stage: any, index) => {
        if (stage.id == stageId) {
          stageIndex = index;
        }
      });
      sub.scores += result;
      if (course.stages.length > stageIndex+1) {
        sub.stage = course.stages[stageIndex+1];
      }else{
        sub.isDone = true;
      }
      const updatedSub = { ...sub };
      delete updatedSub.id;
      sub = await this.subsServices.update(sub.id, updatedSub);
    }
    return sub;
  }
}
