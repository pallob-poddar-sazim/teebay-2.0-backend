import { Module } from "@nestjs/common";
import { FileUploadsController } from "./file-uploads.controller";
import { S3Service } from "@/common/aws/s3-service/s3-service";
import { QueueService } from "./queue.service";
import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "productQueue",
    }),
  ],
  controllers: [FileUploadsController],
  providers: [S3Service, QueueService],
  exports: [S3Service],
})
export class FileUploadsModule {}
