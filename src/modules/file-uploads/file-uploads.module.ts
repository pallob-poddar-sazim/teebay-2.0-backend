import { Module } from "@nestjs/common";
import { FileUploadsService } from "./file-uploads.service";
import { FileUploadsResolver } from "./file-uploads.resolver";
import { S3Module } from "../s3/s3.module";

@Module({
  imports: [S3Module],
  providers: [FileUploadsResolver, FileUploadsService],
})
export class FileUploadsModule {}
