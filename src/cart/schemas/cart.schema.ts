import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Cart {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Item' })
  itemId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Shop' })
  shopId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type:Number , default:1 })
  quantity: number;

  @Prop({ type:String })
  size: string;

  @Prop({ required: true })
  color: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
