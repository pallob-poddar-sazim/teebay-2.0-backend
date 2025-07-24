import { S3Service } from "@/modules/s3/s3.service";
import { Injectable } from "@nestjs/common";
import { PresignedUrlFileDto } from "./file-uploads.dtos";

@Injectable()
export class FileUploadsService {
  constructor(private readonly s3Service: S3Service) {}

  async getPresignedUrl(fileUploadDto: PresignedUrlFileDto) {
    const signedUrl = await this.s3Service.getPresignedUrl(fileUploadDto.name, fileUploadDto.type);
    const publicUrl = signedUrl.replace("http://localstack:4566", "http://localhost:4566");

    return { signedUrl: publicUrl };
  }
}
