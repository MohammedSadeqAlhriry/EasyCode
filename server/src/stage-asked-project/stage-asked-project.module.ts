import { Module } from '@nestjs/common';
import { StageAskedProjectService } from './stage-asked-project.service';
import { StageAskedProjectController } from './stage-asked-project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StageAskedProject } from './entities/stage-asked-project.entity';
import { Stage } from 'src/stages/entities/stage.entity';
import { StagesService } from 'src/stages/stages.service';

@Module({
  imports: [TypeOrmModule.forFeature([ StageAskedProject, Stage])],
  controllers: [StageAskedProjectController],
  providers: [StageAskedProjectService, StagesService]
})
export class StageAskedProjectModule {}
