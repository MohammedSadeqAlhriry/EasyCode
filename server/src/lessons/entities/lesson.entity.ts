import { Like } from "src/likes/entities/like.entity";
import { Stage } from "src/stages/entities/stage.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    // relations
    @ManyToOne(() => Stage, (stage) => stage.lessons)
    stage: Stage;

    @OneToMany(() => Like, (like) => like.lesson)
    likes: Like[];
}
