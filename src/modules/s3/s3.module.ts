import { Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";

@Module({
  providers: [
    S3Service,
    {
      provide: S3Service,
      useFactory: (config: ConfigService) => {
        const region = config.get("AWS_S3_REGION");
        const bucketName = config.get("AWS_S3_BUCKET_NAME");
        const endpoint = config.get("AWS_S3_ENDPOINT");
        const credentials = {
          accessKeyId: config.get("AWS_S3_ACCESS_KEY_ID"),
          secretAccessKey: config.get("AWS_S3_SECRET_ACCESS_KEY"),
        };

        return new S3Service(
          new S3Client({ region, endpoint, forcePathStyle: true, credentials }),
          bucketName,
          config,
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [S3Service],
})
export class S3Module {}
