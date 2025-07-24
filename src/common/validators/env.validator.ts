import { IsNumber, IsPositive, IsString, validateSync } from "class-validator";
import { IEnvironmentVariables } from "../interfaces/envirnonment-variables.interface";
import { plainToInstance } from "class-transformer";

class EnvironmentVariables implements IEnvironmentVariables {
  @IsString()
  DATABASE_URI!: string;

  @IsNumber()
  @IsPositive()
  BE_PORT!: number;

  @IsString()
  AWS_S3_REGION!: string;

  @IsString()
  AWS_S3_ENDPOINT!: string;

  @IsString()
  AWS_S3_BUCKET_NAME!: string;

  @IsString()
  AWS_S3_ACCESS_KEY_ID!: string;

  @IsString()
  AWS_S3_SECRET_ACCESS_KEY!: string;

  @IsNumber()
  @IsPositive()
  AWS_S3_PRESIGNED_URL_EXPIRY_IN_MINUTES!: number;

  @IsString()
  REDIS_HOST!: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
