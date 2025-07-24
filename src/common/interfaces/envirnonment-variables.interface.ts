export interface IEnvironmentVariables {
  DATABASE_URI: string;
  BE_PORT: number;
  AWS_S3_REGION: string;
  AWS_S3_ENDPOINT: string;
  AWS_S3_BUCKET_NAME: string;
  AWS_S3_ACCESS_KEY_ID: string;
  AWS_S3_SECRET_ACCESS_KEY: string;
  AWS_S3_PRESIGNED_URL_EXPIRY_IN_MINUTES: number;
  REDIS_HOST: string;
}
