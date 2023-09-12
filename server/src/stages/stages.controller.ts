import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { StagesService } from './stages.service';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { Stage } from './entities/stage.entity';
import { plainToClass } from 'class-transformer';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';

@Controller('stages')
export class StagesController {
  constructor(
    private readonly stagesService: StagesService,
    private readonly subsService: SubscriptionsService
    ) {}

  @Post()
  async create(@Body() createStageDto: CreateStageDto): Promise<any> {
    const stage = plainToClass(Stage, createStageDto);
    const result = await this.stagesService.create(stage);
    if (!result.message) {
      const numberOfChangedSubs = await this.subsService.changeIsDonePropForAllEnrollmentsInThisCourse(stage.course);
      console.log(numberOfChangedSubs);
    }
    return result;
  }

  @Get()
  async findAll(): Promise<Stage[]> {
    return await this.stagesService.findAll();
  }

  @Get('course-admin-id/:id')
  async getAllByCourseAdminId(@Param('id') id: number): Promise<Stage[]> {
    return await this.stagesService.getAllByCourseAdminId(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Stage> {
    return await this.stagesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateStageDto: UpdateStageDto): Promise<Stage> {
    const stage = plainToClass(Stage, updateStageDto);
    stage.id = id;
    return await this.stagesService.update(id, stage);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.stagesService.delete(id);
  }
}