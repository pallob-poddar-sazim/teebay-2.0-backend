import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "@/config";

@Injectable()
export class S3Service {
  constructor(
    private readonly s3Client: S3Client,
    private readonly bucketName: string,
  ) {}

  getPresignedUrl(key: string, type: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: type,
      ACL: "public-read",
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: config.awsS3PresignedUrlExpiryInMinutes * 60,
    });
  }

  async getObjectStream(key: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    return response.Body as Readable;
  }
}
