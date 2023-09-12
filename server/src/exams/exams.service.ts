import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { plainToClass } from 'class-transformer';
import { Stage } from 'src/stages/entities/stage.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examsRepository: Repository<Exam>,
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    const exam = plainToClass(Exam, createExamDto);
    return this.examsRepository.save(exam);
  }

  async findAll(): Promise<Exam[]> {
    return this.examsRepository.find({ relations: ['stage'] });
  }

  async findOne(id: number): Promise<Exam> {
    const exam = await this.examsRepository.findOne({
      where: { id },
      relations: ['stage']
    });
    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }
    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto): Promise<Exam> {
    const exam = plainToClass(Exam, updateExamDto);
    exam.id = id;
    return this.examsRepository.save(exam);
  }

  async remove(id: number): Promise<void> {
    await this.examsRepository.delete(id);
  }

  async removeStageExams(id: number): Promise<void> {
    const exams = await this.findByStage(id);
    await this.examsRepository.remove(exams);
  }

  async findByStage(stageId: number): Promise<Exam[]> {
    return this.examsRepository.find({
      where: { stage: { id: stageId } },
      relations: ['stage'],
    });
  }

  async calculateResult(stageId: number, examAnswers: { examId: number, answer: string }[]): Promise<number> {
    const exams = await this.examsRepository.find({
      where: { stage: { id: stageId } },
      relations: ['stage']
    });
  
    const totalQuestions = exams.length;
    let correctAnswers = 0;
  
    for (const examAnswer of examAnswers) {
      const exam = exams.find(e => e.id === examAnswer.examId);
      if (!exam) {
        throw new NotFoundException(`Exam with ID ${examAnswer.examId} not found for stage ${stageId}`);
      }
      if (examAnswer.answer === exam.rightAnswer) {
        correctAnswers++;
      }
    }
  
    const result = (correctAnswers / totalQuestions) * 10;
    return Math.round(result);
  }

  
}