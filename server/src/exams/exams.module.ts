import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { Course } from 'src/courses/entities/course.entity';
import { CoursesService } from 'src/courses/courses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, Course,Subscription])],
  controllers: [ExamsController],
  providers: [ExamsService, SubscriptionsService, CoursesService]
})
export class ExamsModule {}
