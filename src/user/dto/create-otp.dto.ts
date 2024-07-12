import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateOtpDto {
  @IsNotEmpty()
  @IsNumber()
  number: number;
}
