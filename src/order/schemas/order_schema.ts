import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define the document type for the shop schema
export type OrderDocument = Order & Document;

export enum OrderStatusTypes {
  INPROGRESS = 'in progress',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
}
// Define the shop schema
@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class Order {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Cart' }], default: [] })
  items: Types.ObjectId[];

  @Prop({ required: true })
  deliveryType: boolean;

  @Prop({ required: true })
  priceTotal: number;

  @Prop({ required: true, default: false })
  paid: boolean;

  @Prop({
    required: true,
    enum: OrderStatusTypes,
    default: OrderStatusTypes.INPROGRESS,
  })
  status: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Shop' })
  shopId: Types.ObjectId;

  @Prop({
    type: {
      city: String,
      country: String,
      streetName: String,

      zipCode: Number,
    },
  })
  userAddress: {
    city: string;
    country?: string;
    streetName: string;

    zipCode: number;
  };
}

// Create the Mongoose schema for the Movie class
export const OrderSchema = SchemaFactory.createForClass(Order);
