import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCouponDto {
  @IsNotEmpty()
  @IsString({ message: 'text must be string' })
  text: string;
  @IsOptional()
  @IsDateString()
  endDate: Date;
  @IsOptional()
  @IsNumber()
  numOfTimes: number;
  @IsNotEmpty()
  @IsNumber()
  discountPercentage: number;
}
