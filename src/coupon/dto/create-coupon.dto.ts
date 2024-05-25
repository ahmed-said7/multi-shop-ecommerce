import { Types } from 'mongoose';

import { IsArray, IsDateString, IsNumber, IsString } from 'class-validator';

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

  subscriptCustomers?: Types.ObjectId[];
}
