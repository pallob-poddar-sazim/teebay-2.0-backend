import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";
import { UUID } from "crypto";

export class MessagesDto {
  @IsString()
  @MaxLength(1000)
  text!: string;

  @IsUUID("4")
  senderId!: UUID;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  conversationId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  participantIds?: UUID[];
}
