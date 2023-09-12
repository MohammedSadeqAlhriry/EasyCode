import { Like } from 'src/likes/entities/like.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { StageAskedProject } from 'src/stage-asked-project/entities/stage-asked-project.entity';
import { User } from 'src/users/entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  documentPath: string;

  @Column({ type: 'varchar', length: 255 })
  imagePath: string;

  @Column({ type: 'text', nullable: true })
  supervisorComment: string;

  @Column({ type: 'integer', default: 0 })
  refusedTimes: number;

  @Column({ default: () => 'getdate()' })
  createdDate: Date;

  @Column({ default: false })
  isSubmitted: boolean;

  @Column({ default: false })
  isAcceptedAndDone: boolean;

  // relations
  @OneToMany(() => Like, (like) => like.project)
  likes: Like[];

  @OneToMany(() => Comment, comment => comment.project)
  comments: Comment[];

  @ManyToOne(() => StageAskedProject, askedProject => askedProject.projects)
  askedProject: StageAskedProject;

  @ManyToOne(() => User, student => student.projects)
  student: User;

  @ManyToOne(() => User, student => student.projects)
  supervisor: User;

  @ManyToOne(() => Course, course => course.projects)
  course: Course;
}