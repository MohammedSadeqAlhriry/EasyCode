import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFiles, UseGuards, Request, ConflictException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { plainToClass } from 'class-transformer';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadFileToDiskStorage } from 'src/helpers/upload-file';
import { Multer } from 'multer';
import * as fs from 'fs';
import { AuthGuard } from 'src/auth/auth.guard'
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly subsServices: SubscriptionsService,
    private readonly notificationsService: NotificationsService
    ) {}

  @Get()
  async findAll(): Promise<Project[]> {
    return this.projectsService.findAll();
  }

  @Get('by-student-id/:id')
  async getByUserId(@Param('id') id: number): Promise<Project[]> {
    return this.projectsService.getByStudentId(id);
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Project> {
    return this.projectsService.findById(id);
  }
  
  @UseGuards(AuthGuard)
  @Get('/getByStageAskedProjectId/:id')
  async getByStageAskedProjectId(@Param('id') id: number,@Request() req) {
    if (req.authData.user.userType != 'student') { return null };
    return await this.projectsService.getByStageAskedProjectId(id, req.authData.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('/unacceptedProjects/:stageId')
  async getUnacceptedProjectsByStageId(@Param('stageId') stageId: string, @Request() req) {
    return await this.projectsService.getUnacceptedProjectsOfUserId(req.authData.user.id, +stageId);
  }

  @UseGuards(AuthGuard)
  @Get('/allProjectsWithStatus/:projectStatus')
  async getAllProjectsWithStatus(@Param('projectStatus') projectStatus: string, @Request() req) {
    if (req.authData.user.userType == 'admin') {
      if (projectStatus == 'accepted') {
        return await this.projectsService.getAcceptedProjects();
      } else {
        return await this.projectsService.getUnacceptedProjects();
      }
    } else if (req.authData.user.userType == 'supervisor') {
      if (projectStatus == 'accepted') {
        return await this.projectsService.getAcceptedAndNotAcceptedProjectsByCourseSupervisorId(
          req.authData.user.id, true
        );
      } else {
        return await this.projectsService.getAcceptedAndNotAcceptedProjectsByCourseSupervisorId(
          req.authData.user.id, false
        );
      }
    } else {
      return [];
    }
  }
  
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 2, UploadFileToDiskStorage),
  )
  async create(@Body() createProjectDto: CreateProjectDto, @UploadedFiles() files: Multer.File[]): Promise<Project> {
    // first lets extract the prject files (image and document)
    const [imageFile, projectFile] = files;
    try {
      createProjectDto.askedProject = JSON.parse(`${createProjectDto.askedProject}`);
      createProjectDto.student = JSON.parse(`${createProjectDto.student}`);
      createProjectDto.course = JSON.parse(`${createProjectDto.course}`);
      const project = plainToClass(Project, createProjectDto);
      project.supervisorComment = "waiting for supervisor comment and confirmation";
      project.isSubmitted = true;
      // setup paths
      if (projectFile) { // check if it is the first time (create project).
        project.imagePath = `/uploads/${imageFile.filename}`;
        project.documentPath = `/uploads/${projectFile.filename}`;
        return this.projectsService.create(project);
      } else if (files[0]) { // only one file which is the project docs
        project.documentPath = `/uploads/${files[0].filename}`;
        // get the old image path 
        const oldProject = await this.projectsService.findOneByStudentIdAndStageAskedProjectId(
          project.student.id,
          project.askedProject.id
        );
        project.imagePath = oldProject.imagePath;
        project.supervisor = oldProject.supervisor;
        return this.projectsService.update(oldProject.id, project);
      }else {
        throw new ConflictException('can not create or update the project');
      }
    } catch (error) {
      console.log(error);
      try {
        imageFile ? fs.unlinkSync(imageFile.path) : null;
        projectFile ? fs.unlinkSync(projectFile.path) : null;
      } catch (error) {
        console.log('error on project controller inside the create method');
      }
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Request() req, @Param('id') id: number, @Body() updateProjectDto: {
    id: number,
    reviewerComment: string,
    accepted: boolean
  }): Promise<Project> {
    if (req.authData.user.userType == 'student') {
      return;
    }
    const project = await this.findById(id);
    project.supervisorComment = updateProjectDto.reviewerComment;
    project.isAcceptedAndDone = updateProjectDto.accepted;
    project.supervisor = req.authData.user;
    if (!project.isAcceptedAndDone) {
      project.refusedTimes++;
      project.isSubmitted = false;
    }else{ // if the project hass been accepted
      this.subsServices.upgradeToNextStage(
        project.student.id,
        project.course.id
      );
      await this.notificationsService.create({
        text: `new project hass been accepted ${project.title}`,
        entityId: project.id,
        pagePath: 'projects',
        pageSection: 'allProjects'        
      });
    }
    return this.projectsService.update(id, project);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.projectsService.delete(id);
  }
}
