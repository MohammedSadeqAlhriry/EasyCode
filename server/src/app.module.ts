import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { StagesModule } from './stages/stages.module';
import { ProjectsModule } from './projects/projects.module';
import { LikesModule } from './likes/likes.module';
import { CoursesModule } from './courses/courses.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { LessonsModule } from './lessons/lessons.module';
import { ExamsModule } from './exams/exams.module';
import { MessagesModule } from './messages/messages.module';
import { StageAskedProjectModule } from './stage-asked-project/stage-asked-project.module';
import { CommentsModule } from './comments/comments.module';
import { ConfirmationsModule } from './confirmations/confirmations.module';
import { DownloadsModule } from './downloads/downloads.module';
import { NotificationsModule } from './notifications/notifications.module';

// entities
import { User } from './users/entities/user.entity';
import { Category } from './categories/entities/category.entity';
import { Course } from './courses/entities/course.entity';
import { Stage } from './stages/entities/stage.entity';
import { Like } from './likes/entities/like.entity';
import { Project } from './projects/entities/project.entity';
import { Subscription } from './subscriptions/entities/subscription.entity';
import { Lesson } from './lessons/entities/lesson.entity';
import { Exam } from './exams/entities/exam.entity';
import { Message } from './messages/entities/message.entity';
import { StageAskedProject } from './stage-asked-project/entities/stage-asked-project.entity';
import { Comment } from './comments/entities/comment.entity';
import { Confirmation } from './confirmations/entities/confirmation.entity';
import { Status } from './notifications/entities/status.entity';
import { Notification } from './notifications/entities/notification.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'sa',
      password: 'abdu123',
      database: 'easycode',
      options: {
        encrypt: false
      },
      entities: [
        User, 
        Category, 
        Course, 
        Stage, 
        Like, 
        Project, 
        Subscription, 
        Lesson, 
        Exam, 
        Message, 
        StageAskedProject, 
        Comment, 
        Confirmation,
        Notification,
        Status
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    CoursesModule,
    StagesModule,
    LikesModule,
    ProjectsModule,
    SubscriptionsModule,
    LessonsModule,
    ExamsModule,
    MessagesModule,
    StageAskedProjectModule,
    CommentsModule,
    ConfirmationsModule,
    DownloadsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
