import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Confirmation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    isConfirmed: boolean;

    @Column()
    reviewerComment: string;

    @Column()
    certificationsDocsPath: string;

    // relations
    @ManyToOne(() => User, user => user.supervisorConfirmation)
    supervisor: User;

    @ManyToOne(() => User, user => user.reviewerConfirmations)
    reviewer: User;
}
