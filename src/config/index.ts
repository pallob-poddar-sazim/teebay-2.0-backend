import dotenv from "dotenv";

class Config {
  public readonly port: number;
  public readonly databaseUri: string;
  public readonly nodeEnv: string;
  public readonly postgresDB: string;
  public readonly postgresUser: string;
  public readonly postgresPassword: string;
  public readonly awsRegion: string;
  public readonly awsEndpoint: string;
  public readonly awsAccessKeyId: string;
  public readonly awsSecretAccessKey: string;
  public readonly awsS3BucketName: string;
  public readonly redisHost: string;
  public readonly dbHost: string;

  constructor() {
    dotenv.config();
    this.port = Number(process.env.PORT) || 4000;
    this.databaseUri = process.env.DATABASE_URI || "";
    this.nodeEnv = process.env.NODE_ENV || "development";
    this.postgresDB = process.env.POSTGRES_DB || "";
    this.postgresUser = process.env.POSTGRES_USER || "";
    this.postgresPassword = process.env.POSTGRES_PASSWORD || "";
    this.awsRegion = process.env.AWS_REGION || "";
    this.awsS3BucketName = process.env.AWS_S3_BUCKET_NAME || "";
    this.awsEndpoint = process.env.AWS_ENDPOINT || "";
    this.awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
    this.awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
    this.redisHost = process.env.REDIS_HOST || "localhost";
    this.dbHost = process.env.DB_HOST || "localhost";
  }
}

export default new Config();
