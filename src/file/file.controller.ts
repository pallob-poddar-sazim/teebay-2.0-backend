import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';

@Controller()
export class FileController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['text/csv', 'application/csv'];

        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Invalid file type'), false);
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds the limit of 10MB');
    }

    try {
      const key = `uploads/${uuidv4()}-${file.originalname}`;

      const s3Url = await this.s3Service.uploadFile(
        file.buffer,
        key,
        file.mimetype,
      );

      return {
        message: 'File uploaded successfully',
        filename: file.originalname,
        url: s3Url,
        size: file.size,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('File upload failed');
    }
  }
}
