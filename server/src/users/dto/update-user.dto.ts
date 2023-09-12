import { Transform } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsDate, IsOptional, IsEmpty, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsOptional()
  oldPassword: string;

  @IsOptional()
  newPassword: string;

  @IsNotEmpty()
  userType: string;

  @IsNotEmpty()
  userDescription: string;

  @Transform( ({ value }) => value && new Date(value))
  @IsDate()
  birthDate: Date;

  @IsNotEmpty()
  address: string;

  @IsOptional()
  isPhotoChanged: boolean;

  @IsOptional()
  isCertificationsDocsChanged: boolean;
}
