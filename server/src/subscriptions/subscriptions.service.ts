import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { Stage } from 'src/stages/entities/stage.entity';
import { Course } from 'src/courses/entities/course.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionsRepository.find({
      relations: ['user', 'course','stage'],
    });
  }

  async changeIsDonePropForAllEnrollmentsInThisCourse(course: Course): Promise<number> {
    const subs = await this.subscriptionsRepository.find({ where: { course: { id: course.id }}});
    subs.forEach((sub) => { sub.isDone = false; });
    await this.subscriptionsRepository.save(subs);
    return subs.length;
  }

  async upgradeToNextStage(userId: number, courseId: number): Promise<boolean> {
    const sub = await this.subscriptionsRepository.findOne({
      where: {
        user: { id: userId },
        course: { id: courseId }
      },
      relations: ['stage']
    });
    const course = await this.coursesRepository.findOne({ 
      where: { id: courseId },
      relations: ['stages']
    });
    if (sub && course) {
      const stage: Stage = await this.getNextStage(course, sub.stage.id);
      if (sub.isDone) { return false; } else { sub.scores += 10; }
      stage.id > sub.stage.id ? sub.stage = stage : sub.isDone = true;
      this.subscriptionsRepository.save(sub); // update
      return true;
    }
    console.log("this is after the if and stell run");
    return false;
  }

  private async getNextStage(course: Course, currentStageId: number): Promise<Stage> {
    if (course.stages[course.stages.length - 1].id > currentStageId) {
      return await course.stages.find(stage => stage.id > currentStageId);
    } else {
      return course.stages[course.stages.length - 1];
    }
  }

  async findById(id: number): Promise<Subscription> {
    return this.subscriptionsRepository.findOne({
        where: { id },
        relations: ['user', 'course','stage'],
    });
  }

  async findByUser(userId: number): Promise<Subscription[]> {
    return this.subscriptionsRepository.find({
        where: { user: { id: userId } },
        relations: ['user', 'course','stage','course.likes'],
    });
  }

  async findByCourse(courseId: number): Promise<Subscription[]> {
    return this.subscriptionsRepository.find({
        where: { course: { id: courseId } },
        relations: ['user', 'course','stage'],
    });
  }

  async findByUserAndCourse(courseId: number, userId: number): Promise<Subscription>{
    return this.subscriptionsRepository.findOne({
      where: { course: { id: courseId }, user: { id: userId}},
      relations: ['stage','user', 'course']
    });
  }

  async create(subscription: Subscription): Promise<Subscription> {
    return this.subscriptionsRepository.save(subscription);
  }

  async update(id: number, subscription: Subscription): Promise<Subscription> {
    await this.subscriptionsRepository.update(id, subscription);
    return this.findById(id);
  }

  async delete(id: number): Promise<any> {
    await this.subscriptionsRepository.delete(id);
    return {message: 'deleted'};
  }

  async getCurrentStage(subscriptionId: number): Promise<Stage> {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id: subscriptionId },
      relations: ['stage'],
    });
    
    if (!subscription) {
      throw new Error(`Subscription with id ${subscriptionId} not found`);
    }

    return subscription.stage;
  }
}