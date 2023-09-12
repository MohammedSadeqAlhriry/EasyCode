import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  async createComment(comment: Comment): Promise<Comment> {
    return await this.commentRepository.save(comment);
  }

  async getCommentById(id: number): Promise<Comment> {
    return await this.commentRepository.findOne({ 
      where: { id: id}, 
      relations: ['user', 'course', 'project'] 
    });
  }

  async getAllComments(): Promise<Comment[]> {
    return await this.commentRepository.find({ relations: ['user', 'course', 'project'] });
  }

  async updateComment(comment: Comment): Promise<Comment> {
    return await this.commentRepository.save(comment);
  }

  async deleteComment(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }

  async getCommentsByCourseId(courseId: number): Promise<Comment[]> {
    return await this.commentRepository.find({ 
      where: { course: { id: courseId } }, 
      relations: ['user', 'course', 'project'] 
    });
  }

  async getCommentsByProjectId(projectId: number): Promise<Comment[]> {
    return await this.commentRepository.find({ 
      where: { project: { id: projectId } }, 
      relations: ['user', 'course', 'project'] 
    });
  }
}