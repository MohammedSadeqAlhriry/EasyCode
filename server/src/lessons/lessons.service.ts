import { Injectable } from '@nestjs/common';
import { Lesson } from './entities/lesson.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonsRepository: Repository<Lesson>
    ) {}
  
  async create(lessons: Lesson[]) {
    return await this.lessonsRepository.save(lessons);
  }

  async findAll() {
    return await this.lessonsRepository.find();
  }

  async findOne(id: number) {
    return await this.lessonsRepository.find({ where: { id: id }});
  }

  async findStageLessons(id: number) {
    return await this.lessonsRepository.find({ where: { stage: { id: id }}});
  }

  async update(lessons: Lesson[]) {
    return await this.lessonsRepository.save(lessons);
  }

  async remove(id: number) {
    await this.lessonsRepository.delete(id);
  }

  async removeStageLessons(id: number){
    const lessons = await this.findStageLessons(id);
    await this.lessonsRepository.remove(lessons);
  }

  
}
