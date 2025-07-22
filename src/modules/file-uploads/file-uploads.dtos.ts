import { IsString, Matches, MaxLength } from "class-validator";

export class PresignedUrlFileDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsString()
  @Matches(/^text\/csv$/, { message: "Only CSV files are allowed" })
  type!: string;
}
