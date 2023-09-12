import { PartialType } from '@nestjs/mapped-types';
import { CreateStageAskedProjectDto } from './create-stage-asked-project.dto';

export class UpdateStageAskedProjectDto extends PartialType(CreateStageAskedProjectDto) {}
