import { Types } from 'mongoose';
import { PartialType } from '@nestjs/mapped-types';

import { CreateOrderDto } from './create-order.dto';
import { OrderStatusTypes } from '../schemas/order_schema';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  items: Types.ObjectId[];

  deliveryType: boolean;

  priceTotal: number;

  paid: boolean;

  status: OrderStatusTypes;

  comments: string;
}
