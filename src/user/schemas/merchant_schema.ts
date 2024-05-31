import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import validator from 'validator';

export type MerchantDocument = Merchant & Document;

@Schema({
  timestamps: true,
})
export class Merchant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: 'merchant' })
  role: string;

  @Prop({
    required: true,
    unique: true,
    validate: [
      (v: string) => validator.isEmail(v),
      'Please Enter A Valid Email',
    ],
  })
  email: string;

  @Prop({ unique: true })
  phone: string;

  @Prop({ type: Types.ObjectId, ref: 'Shop' })
  shopId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  reviews: Types.ObjectId[];

  @Prop({ default: 0 })
  wallet: number;

  @Prop({ enum: ['male', 'female'] })
  gender: string;

  @Prop({ default: Date.now().toLocaleString() })
  birthday: string;
}

// Create the Mongoose schema for the user class
export const MerchantSchema = SchemaFactory.createForClass(Merchant);
