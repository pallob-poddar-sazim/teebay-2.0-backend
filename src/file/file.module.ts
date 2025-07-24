import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { S3Service } from './s3.service';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'productQueue',
    }),
  ],
  controllers: [FileController],
  providers: [S3Service, QueueService],
  exports: [S3Service],
})
export class FileModule {}
