import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderStatusTypes } from 'src/common/enums';

// Define the document type for the shop schema
export type OrderDocument = Order & Document;

// Define the shop schema
@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
  // toJSON:{virtuals:true},
  // toObject:{virtuals:true}
})
export class Order {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Item' },
        quantity: Number,
        size: String,
        color: String,
      },
    ],
    default: [],
  })
  cartItems: {
    product: Types.ObjectId;
    quantity: number;
    size: string;
    color: string;
  }[];

  @Prop({ type: Boolean, default: false })
  delivered: boolean;

  @Prop({ required: true })
  priceTotal: number;

  @Prop({ type: Boolean, default: false })
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
      mobile: String,
    },
  })
  userAddresse: {
    city: string;
    country?: string;
    streetName: string;
    zipCode: number;
    mobile: string;
  };
}

// Create the Mongoose schema for the Movie class
export const OrderSchema = SchemaFactory.createForClass(Order);
