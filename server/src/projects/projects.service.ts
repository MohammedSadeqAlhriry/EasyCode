import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { Course } from 'src/courses/entities/course.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['likes','comments','askedProject','student','supervisor','course']
    });
  }

  async getByStudentId(studentId: number): Promise<Project[]> {
    return this.projectRepository.find({
      where: { student: { id: studentId }},
      relations: ['likes','comments','askedProject','student','supervisor','course']
    });
  }

  async findOneByStudentIdAndStageAskedProjectId(studentId: number, stageAskedProjectId: number) {
    return this.projectRepository.findOne({
      where: { student: { id: studentId }, askedProject: { id: stageAskedProjectId }},
      relations: ['likes','comments','askedProject','student','supervisor']
    });
  }

  async findById(id: number): Promise<Project> {
    return this.projectRepository.findOne({
      where: { id: id},
      relations: ['likes','comments','askedProject','student','supervisor', 'course']
    });
  }

  async getByStageAskedProjectId(askedProjectId: number, studentId: number): Promise<any> {
    return await this.projectRepository.findOne({
      where: { askedProject: { id: askedProjectId }, student: { id: studentId}},
      relations: ['likes','comments','askedProject','student','supervisor']
    });
  }

  async getUnacceptedProjectsOfUserId(userId: number, stageId: number): Promise<any> {
    return await this.projectRepository.findOne({
      where: { askedProject:{ stage: { id: stageId}}, student: { id: userId}, isAcceptedAndDone: false},
      relations: ['likes','comments','askedProject','student','supervisor']
    });
  }

  async getUnacceptedProjects(): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { isAcceptedAndDone: false, isSubmitted:true },
      relations: ['likes','comments','askedProject','student','supervisor']
    });
  }

  async getAcceptedProjects(): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { isAcceptedAndDone: true },
      relations: ['likes','comments','askedProject','student','supervisor']
    });
  }

  async getAcceptedAndNotAcceptedProjectsByCourseSupervisorId(supervisorId: number, isAccepted: boolean): Promise<Project[]> {
    const projects: Project[] = new Array();
    const courses: Course[] = await this.coursesRepository.find({
      where: { subscriptions: { user: { id: supervisorId }}},
      relations: ['projects', 'projects.student','projects.supervisor','projects.askedProject']
    });
    courses.forEach((course: Course) => {
      course.projects.forEach((project: Project) => {
        if (project.isAcceptedAndDone == isAccepted) {
          projects.push(project);
        }
      });
    });
    return projects;
  }

  async create(projectData: Project): Promise<Project> {
    const newProject = this.projectRepository.create(projectData);
    return this.projectRepository.save(newProject);
  }

  async update(id: number, projectData: Partial<Project>): Promise<Project> {
    const projectToUpdate = await this.projectRepository.findOne({ where: { id: id}});
    this.projectRepository.merge(projectToUpdate, projectData);
    return this.projectRepository.save(projectToUpdate);
  }

  async delete(id: number): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
