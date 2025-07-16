import { IsEmail, IsPhoneNumber, IsString, IsStrongPassword, MaxLength } from "class-validator";

export class UserDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsString()
  @MaxLength(255)
  address!: string;

  @IsEmail()
  email!: string;

  @IsPhoneNumber("BD")
  phone!: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password!: string;
}
