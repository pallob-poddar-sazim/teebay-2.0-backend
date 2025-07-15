import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import config from 'src/config';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string = config.awsS3BucketName;

  constructor() {
    this.s3Client = new S3Client({
      region: config.awsRegion,
      endpoint: config.awsEndpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.awsAccessKeyId,
        secretAccessKey: config.awsSecretAccessKey,
      },
    });
  }

  async uploadFile(
    fileBuffer: Buffer,
    key: string,
    mimetype?: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimetype,
    });

    await this.s3Client.send(command);
    return `http://localhost:4566/${this.bucketName}/${key}`;
  }
}
