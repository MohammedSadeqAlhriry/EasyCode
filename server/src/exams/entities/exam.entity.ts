import { Stage } from 'src/stages/entities/stage.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column()
  answer: string;

  @Column()
  rightAnswer: string;

  @ManyToOne(() => Stage, stage => stage.exams)
  stage: Stage;
}