import { Controller, Get, Post, Put, Delete, Param, Body, ForbiddenException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { plainToClass } from 'class-transformer';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createComment(@Body() commentDTO: CreateCommentDTO): Promise<Comment> {
    const comment = plainToClass(Comment, commentDTO);
    if ((comment.course || comment.project) && comment.user){
      return await this.commentsService.createComment(comment);
    }else{
      throw new ForbiddenException('you must include the user and the course or the project that the user comment on');
    }
  }

  @Get(':id')
  async getCommentById(@Param('id') id: number): Promise<Comment> {
    return await this.commentsService.getCommentById(id);
  }

  @Get()
  async getAllComments(): Promise<Comment[]> {
    return await this.commentsService.getAllComments();
  }

  @Put(':id')
  async updateComment(@Param('id') id: number, @Body() commentDTO: UpdateCommentDto): Promise<Comment> {
    const comment = plainToClass(Comment, { id, ...commentDTO });
    if ((comment.course || comment.project) && comment.user){
      return await this.commentsService.updateComment(comment);
    }else{
      throw new ForbiddenException('you must include the user and the course or the project that the user comment on');
    }
  }

  @Delete(':id')
  async deleteComment(@Param('id') id: number): Promise<void> {
    return await this.commentsService.deleteComment(id);
  }

  @Get('course/:id')
  async getCommentsByCourseId(@Param('id') courseId: number): Promise<Comment[]> {
    return await this.commentsService.getCommentsByCourseId(courseId);
  }

  @Get('project/:id')
  async getCommentsByProjectId(@Param('id') projectId: number): Promise<Comment[]> {
    return await this.commentsService.getCommentsByProjectId(projectId);
  }
}