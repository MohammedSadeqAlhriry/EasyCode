import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateConfirmationDto {
    @IsNotEmpty()
    @IsBoolean()
    isConfirmed: boolean;
    
    @IsString()
    @IsOptional()
    reviewerComment: string;

    @IsNotEmpty()
    certificationsDocsPath: string;
    
    @IsObject()
    @IsNotEmpty()
    supervisor: User;

    @IsObject()
    @IsNotEmpty()
    reviewer: User;
}
