import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCouponDto {
  @IsNotEmpty()
  @IsString({ message: 'text must be string' })
  text: string;
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
  @IsNotEmpty()
  @IsNumber()
  numOfTimes: number;
  @IsNotEmpty()
  @IsNumber()
  discountPercentage: number;
}
