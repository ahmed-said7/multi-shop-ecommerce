import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponDto } from './create-coupon.dto';
import { Types } from 'mongoose';
import {
  IsString,
  IsDate,
  IsNumber,
  IsArray,
  IsDateString,
} from 'class-validator';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {
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
  @IsArray()
  subscriptCustomers?: Types.ObjectId[];
}
