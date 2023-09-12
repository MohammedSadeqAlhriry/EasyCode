import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { BcryptService } from 'src/auth/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private bcryptService: BcryptService,
  ) {}

  async create(user: User): Promise<User> {
    if ( // checking if the user exist or not
      await this.usersRepository.findOne({ where: { email: user.email}}) ||
      await this.usersRepository.findOne({ where: { username: user.username}})
    ) {
      throw new HttpException('User with this email or username already exists!.', HttpStatus.BAD_REQUEST);
    }
    user.password = await this.bcryptService.hash(user.password, 10);
    const createdUser =  await this.usersRepository.save(user);
    return await this.usersRepository.findOne({ where: { id: createdUser.id}});
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({ 
      where: { isDeleted: false},
      relations: ['supervisorConfirmation', 'reviewerConfirmations', 'subscriptions','projects']
    });
  }

  async findAllByType(userType: string): Promise<User[]> {
    return await this.usersRepository.find({ 
      where: { userType: userType, isDeleted: false},
      relations: ['supervisorConfirmation', 'reviewerConfirmations', 'subscriptions','projects']
    });
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne({ 
      where: { id: id, isDeleted: false},
      relations: ['supervisorConfirmation', 'reviewerConfirmations', 'subscriptions','projects']
    });
  }

  async findOneById_WithTheNecessaryRelations(id: number): Promise<User> {
    return await this.usersRepository.findOne({ 
      where: { id: id, isDeleted: false},
      relations: ['supervisorConfirmation', 'reviewerConfirmations', 'subscriptions','projects']
    });
  }

  async findOneById_WithThisRelations(id:number, relations: []): Promise<User> {
    return await this.usersRepository.findOne({ 
      where: { id: id, isDeleted: false}, relations: relations });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOne({ 
      where: { username: username, isDeleted: false},
      relations: ['supervisorConfirmation', 'reviewerConfirmations', 'subscriptions','projects']
    });
  }

  async findByUserEmail (email: string): Promise<User> {
    return await this.usersRepository.findOne({ 
      where: { email: email, isDeleted: false},
      relations: ['supervisorConfirmation', 'reviewerConfirmations', 'subscriptions','projects']
    });
  }

  async update(user: User): Promise<User> {
    await this.usersRepository.save(user);
    return await this.usersRepository.findOne({
      where: { id: user.id},
      relations: ['supervisorConfirmation', 'reviewerConfirmations', 'subscriptions','projects']
    });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.update(id, { isDeleted: true });
  }
}