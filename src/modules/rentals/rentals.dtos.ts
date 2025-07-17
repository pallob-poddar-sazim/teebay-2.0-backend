import { IsDateString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class RentalDto {
  @IsUUID("4")
  productId!: UUID;

  @IsUUID("4")
  borrowerId!: UUID;

  @IsDateString()
  rentStartDate!: Date;

  @IsDateString()
  rentEndDate!: Date;
}
