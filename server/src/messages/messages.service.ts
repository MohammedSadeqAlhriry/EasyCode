import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from 'src/users/entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = this.messagesRepository.create(createMessageDto);
    message.DateAndTime = new Date();
    const createdMessage = await this.messagesRepository.save(message);
    return await this.messagesRepository.findOne({
      where: { id: createdMessage.id },
      relations: ['course','sender']
    });
  }

  async getByCourse(course: Course): Promise<Message[]> {
    return await this.messagesRepository.find({ where: { course: course }, relations: ['sender']});
  }

  async howMany(): Promise<number> {
    return (await this.messagesRepository.find()).length;
  }

  async findOne(id: number): Promise<Message> {
    return await this.messagesRepository.findOne({ where: { id: id }});
  }

  async remove(id: number, user: User): Promise<void> {
    const message = await this.findOne(id);
    if (message.sender.id == user.id){
      await this.messagesRepository.delete(id);
    }
  }
}