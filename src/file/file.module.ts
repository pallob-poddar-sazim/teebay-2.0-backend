import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { S3Service } from './s3.service';

@Module({
  controllers: [FileController],
  providers: [S3Service],
})
export class FileModule {}
