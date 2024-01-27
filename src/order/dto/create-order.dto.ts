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
  @IsNotEmpty({ message: 'Seller ID is required' })
  @IsString({ message: 'An order must have a string buyerID' })
  buyerId: string;

  @IsNotEmpty({ message: 'Seller ID is required' })
  @IsString({ message: 'An order must have a string sellerID' })
  sellerId: string;

  @IsNotEmpty({ message: 'An order must have at least one item' })
  @IsArray({ message: 'An order must have a string array of items' })
  items: Types.Array<{ itemID: string; price: number }>;

  @IsNotEmpty({ message: 'An order must have a delivery type' })
  @IsBoolean({ message: 'Delivery type must be boolean' })
  deliveryType: boolean;

  @IsNotEmpty({ message: 'Is the order paid or not?' })
  @IsBoolean({ message: 'Paid property type must be boolean' })
  paid: boolean;

  @IsNotEmpty({ message: 'An order must have a status' })
  @IsEnum(OrderStatusTypes, { message: 'Invalid order status' })
  status: string;

  @IsString({ message: 'An order must have a string comment' })
  @MinLength(10, {
    message: 'An order comment must be 10 chracters minimum',
  })
  @MaxLength(150, {
    message: 'An order comment must be 150 chracters maximum',
  })
  comments: string;


  priceTotal: number;
}
