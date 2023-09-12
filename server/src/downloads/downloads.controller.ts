import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';

@Controller('downloads')
export class DownloadsController {
  constructor() {}

  @Get(':filename')
  downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    const file = join(process.cwd(), 'public', 'uploads', filename);
    const fileStream = fs.createReadStream(file);
    fileStream.on('error', (error) => {
      console.error(error);
      res.status(500).send('Error downloading file.');
    });

    fileStream.pipe(res);
  }
}
