import { DateTime } from 'luxon';
import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { UserRole } from '../../user/schemas/user_schema';

export type MerchantDocument = HydratedDocument<Merchant>;

@Schema({
  timestamps: true,
})
export class Merchant {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  phone: string;

  @Prop({ min: 0, default: 0 })
  wallet: number;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: DateTime.now().setZone('GMT').toISO() })
  birthday: string;

  @Prop({ required: true, default: 'other', enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop({
    required: true,
    default: UserRole.MERCHANT,
    enum: [UserRole.MERCHANT],
  })
  role: string;

  @Prop({ unique: true, type: Types.ObjectId, ref: 'Shop' })
  shop: string;
}

export const merchantSchema = SchemaFactory.createForClass(Merchant);
