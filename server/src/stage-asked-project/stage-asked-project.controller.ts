import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { StageAskedProjectService } from './stage-asked-project.service';
import { CreateStageAskedProjectDto } from './dto/create-stage-asked-project.dto';
import { UpdateStageAskedProjectDto } from './dto/update-stage-asked-project.dto';
import { plainToClass } from 'class-transformer';
import { StageAskedProject } from './entities/stage-asked-project.entity';
import { UploadFileToDiskStorage } from 'src/helpers/upload-file';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import * as fs from 'fs';
import { validate } from 'class-validator';

@Controller('stage-asked-project')
export class StageAskedProjectController {
  constructor(private readonly stageAskedProjectService: StageAskedProjectService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 1, UploadFileToDiskStorage),
  )
  async create(@Body() createStageAskedProjectDto: CreateStageAskedProjectDto, @UploadedFiles() files: Multer.File[]): Promise<StageAskedProject> {
    const [projectFile] = files;
    try {
      createStageAskedProjectDto.stage = JSON.parse(`${createStageAskedProjectDto.stage}`);
      const stageAskedProject = plainToClass(StageAskedProject, createStageAskedProjectDto);
      stageAskedProject.documentsPath = `/uploads/${projectFile.filename}`;
      return await this.stageAskedProjectService.create(stageAskedProject);
    } catch (error) {
      if (projectFile) {
        try{fs.unlinkSync(projectFile.path);}catch(error){};
      }
    }
  }

  @Get()
  async findAll(): Promise<StageAskedProject[]> {
    return await this.stageAskedProjectService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<StageAskedProject> {
    return await this.stageAskedProjectService.findOne(+id);
  }

  @Get('/stage/:id')
  async findByStageId(@Param('id') id: string): Promise<StageAskedProject>{
    return await this.stageAskedProjectService.findByStageId(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStageAskedProjectDto: UpdateStageAskedProjectDto) {
    const stageAskedProject = plainToClass(StageAskedProject, updateStageAskedProjectDto);
    return this.stageAskedProjectService.update(stageAskedProject);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const stageAskedProjectFoundObject = await this.stageAskedProjectService.findOne(+id);
    if (stageAskedProjectFoundObject) {
      try{
        fs.unlinkSync('public' + stageAskedProjectFoundObject.documentsPath);
      }catch(error){
        console.log(error);
      };
      return this.stageAskedProjectService.remove(stageAskedProjectFoundObject.id);
    }
  }
}
