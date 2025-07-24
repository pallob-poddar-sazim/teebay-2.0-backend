import { ERentOption } from "@/common/enums/products.enums";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from "class-validator";
import { UUID } from "crypto";
import { PartialType, OmitType } from "@nestjs/graphql";

export class ProductCreationDto {
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsArray()
  @IsUUID("4", { each: true })
  @ArrayMaxSize(10)
  @ArrayMinSize(1)
  categoryIds!: UUID[];

  @IsString()
  @MaxLength(1000)
  description!: string;

  @IsNumber()
  @Max(1000000)
  @Min(0)
  price!: number;

  @IsNumber()
  @Max(1000000)
  @Min(0)
  rent!: number;

  @IsEnum(ERentOption)
  rentOption!: ERentOption;

  @IsUUID("4")
  sellerId!: UUID;
}

export class ProductUpdateDto extends PartialType(OmitType(ProductCreationDto, ["sellerId"])) {
  @IsUUID("4")
  id!: UUID;
}
