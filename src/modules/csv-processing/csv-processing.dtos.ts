import { IsString, MaxLength } from "class-validator";

export class CSVRowDto {
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsString()
  @MaxLength(500)
  categoryIds!: string;

  @IsString()
  @MaxLength(1000)
  description!: string;

  @IsString()
  @MaxLength(6)
  price!: string;

  @IsString()
  @MaxLength(6)
  rent!: string;

  @IsString()
  @MaxLength(3)
  rentOption!: string;

  @IsString()
  @MaxLength(20)
  sellerId!: string;
}
