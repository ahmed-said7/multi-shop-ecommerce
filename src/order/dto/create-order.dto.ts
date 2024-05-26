import {
  IsNotEmpty,
  IsString,
  IsArray,
  MinLength,
  MaxLength,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { OrderStatusTypes } from '../schemas/order_schema';
import { Types } from 'mongoose';

export class CreateOrderDto {
  userId: string;

  @IsNotEmpty({ message: 'An order must have a delivery type' })
  @IsBoolean({ message: 'Delivery type must be boolean' })
  deliveryType: boolean;

  @IsNotEmpty({ message: 'An order must have a status' })
  @IsEnum(OrderStatusTypes, { message: 'Invalid order status' })
  status: OrderStatusTypes;

  @IsNotEmpty({ message: 'An order must have a shop' })
  shopId: string;

  priceTotal: number;

  userAddress?: {
    city?: string;
    country?: string;
    streetName?: string;
    zipCode?: number;
  };

  couponName: string;
}
