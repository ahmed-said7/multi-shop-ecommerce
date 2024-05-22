import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Coupon {
  @Prop({ required: true, unique: true, minlength: 3, maxlength: 50 })
  text: string;

  @Prop({
    required: true,
    default: DateTime.now().plus({ days: 10 }).toJSDate(),
  })
  endDate: string;

  @Prop({
    required: true,
    default: 1,
    min: 1,
  })
  numOfTimes: number;

  @Prop({
    required: true,
    default: 1,
    min: 1,
    max: 100,
  })
  numOfCustomers: number;

  @Prop({
    required: true,
    min: 1,
    max: 90,
  })
  discountPercentage: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Shop' })
  shopId: Types.ObjectId;

  @Prop({ required: true, type: [Types.ObjectId], ref: 'Item', maxlength: 100 })
  items: string[];

  @Prop({ type: [Types.ObjectId], ref: 'User', maxlength: 100 })
  subscriptCustomers?: Types.ObjectId[];
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
