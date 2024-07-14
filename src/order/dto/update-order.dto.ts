import { Types } from 'mongoose';
import { PartialType } from '@nestjs/mapped-types';

import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  items: Types.ObjectId[];

  deliveryType: boolean;

  priceTotal: number;

  paid: boolean;

  comments: string;
}
