import { Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import config from "@/config";
import { S3Client } from "@aws-sdk/client-s3";

@Module({
  providers: [
    S3Service,
    {
      provide: S3Service,
      useFactory: () => {
        const region = config.awsRegion;
        const endpoint = config.awsEndpoint;
        const credentials = {
          accessKeyId: config.awsAccessKeyId,
          secretAccessKey: config.awsSecretAccessKey,
        };

        return new S3Service(
          new S3Client({ region, endpoint, forcePathStyle: true, credentials }),
          config.awsS3BucketName,
        );
      },
    },
  ],
  exports: [S3Service],
})
export class S3Module {}
