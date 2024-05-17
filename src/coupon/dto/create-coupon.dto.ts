import {
  IsArray,
  IsDate,
  IsDateString,
  IsNumber,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateCouponDto {
  @IsString({ message: 'text must be string' })
  text: string;
  @IsDateString()
  endDate: Date;
  @IsNumber()
  numOfTimes: number;
  @IsNumber()
  discountPercentage: number;
  @IsArray()
  items: Types.ObjectId[];
}
