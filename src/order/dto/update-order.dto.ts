import { Types } from 'mongoose';
import { PartialType } from '@nestjs/mapped-types';
import { IsString, MinLength, MaxLength, IsEnum } from 'class-validator';

import { CreateOrderDto } from './create-order.dto';
import { OrderStatusTypes } from '../schemas/order_schema';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  items: Types.ObjectId[];

  deliveryType: boolean;

  priceTotal: number;

  paid: boolean;

  @IsEnum(OrderStatusTypes, { message: 'Invalid order Status' })
  status: string;

  @IsString({ message: 'An order must have a string comment' })
  @MinLength(10, {
    message: 'An order comment must be 10 chracters minimum',
  })
  @MaxLength(150, {
    message: 'An order comment must be 150 chracters maximum',
  })
  comments: string;
}
