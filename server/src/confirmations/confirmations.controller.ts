import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import * as fs from 'fs';
import { UploadFileToDiskStorage } from 'src/helpers/upload-file';
import { ConfirmationsService } from './confirmations.service';
import { CreateConfirmationDto } from './dto/create-confirmation.dto';
import { UpdateConfirmationDto } from './dto/update-confirmation.dto';
import { Confirmation } from './entities/confirmation.entity';
import { plainToClass } from 'class-transformer';

@Controller('confirmations')
export class ConfirmationsController {
  constructor(private readonly confirmationsService: ConfirmationsService) {}

  @Post(':id')
  @UseInterceptors(
    FilesInterceptor('files', 1, UploadFileToDiskStorage),
  )
  async create(@Param('id') id: string, @UploadedFiles() files: Multer.File[]) {
    const [certificationsDocs] = files;
    if (!certificationsDocs) { return; }
    const confirmation = await this.confirmationsService.getById(+id) as Confirmation;
    ////  here you need to put token checking that user own this confirmation entity
    // delelete the old file
    try {
      fs.unlinkSync(`public/${confirmation.certificationsDocsPath}`);
    } catch (error) {}
    // change the certificationsDocsPath value to address the new file
    confirmation.certificationsDocsPath = `/uploads/${certificationsDocs.filename}`;
    return await this.confirmationsService.updateEntity(confirmation);
  }

  @Get()
  findAll() {
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateConfirmationDto: UpdateConfirmationDto) {
    const confirmation = plainToClass(Confirmation, updateConfirmationDto);
    return await this.confirmationsService.update(+id, confirmation);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
  }
}
