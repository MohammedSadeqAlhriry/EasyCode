import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export const createUserDtoToUserEntity = (createUserDto: CreateUserDto): User => {
  const user = new User();
  user.signupDate = new Date();
  user.birthDate = createUserDto.birthDate;
  user.address = createUserDto.address;
  user.email = createUserDto.email;
  user.username = createUserDto.username;
  user.userType = createUserDto.userType;
  user.picturePath = createUserDto.picturePath;
  user.fullName = createUserDto.fullName;
  user.password = createUserDto.password;
  user.userDescription = createUserDto.userDescription;
  user.currentCourseId = createUserDto.currentCourseId;
  return user;
};

export const updateUserDtoToUserEntity = (updateUserDto: UpdateUserDto, existUser: User): User => {
  // just add the new things
  const user  = new User();
  user.birthDate = updateUserDto.birthDate;
  user.address = updateUserDto.address;
  user.email = updateUserDto.email;
  user.username = updateUserDto.username;
  user.fullName = updateUserDto.fullName;
  user.userDescription = updateUserDto.userDescription;
  return user;
};
