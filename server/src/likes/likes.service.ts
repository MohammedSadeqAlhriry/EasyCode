import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { LikeDto } from './dto/like.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>
  ) {}

  async toggleLikeCourse(likeDto: LikeDto): Promise<any> {
    let like = await this.likeRepository.findOne({
      where: { user: { id: likeDto.user.id }, course: { id: likeDto.course.id }},
    });
    if (like) { // unlike the course if it is exist
      await this.likeRepository.remove(like)
      return {message: "course's like has been removed", like:like};
    } else {
      const newLike = plainToClass(Like, likeDto)
      like = await this.likeRepository.save(newLike);
      return {message: "course's like added", like};
    }
  }

  async toggleLikeLesson(likeDto: LikeDto): Promise<any> {
    let like = await this.likeRepository.findOne({
      where: { user: { id: likeDto.user.id }, lesson: { id: likeDto.lesson.id }},
    });
    if (like) { // unlike the course if it is exist
      await this.likeRepository.remove(like)
      return {message: "lesson's like has been removed", like:like};
    } else {
      const newLike = plainToClass(Like, likeDto)
      like = await this.likeRepository.save(newLike);
      return {message: "lesson's like added", like};
    }
  }

  async toggleLikeProject(likeDto: LikeDto): Promise<any> {
    let like = await this.likeRepository.findOne({
      where: { user: { id: likeDto.user.id }, project: { id: likeDto.project.id }},
    });
    if (like) {
      await this.likeRepository.remove(like)
      return {message: "project's like has been removed", like:like};
    } else {
      const newLike = plainToClass(Like, likeDto)
      like = await this.likeRepository.save(newLike);
      return {message: "project's like added", like};
    }
  }

  

  async getAll(): Promise<Like[]> {
    return await this.likeRepository.find({ relations: ['user', 'course'] });
  }

}