import { DateTime } from 'luxon';
import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AllRoles } from 'src/common/enums';


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
    default: AllRoles.MERCHANT,
    enum: [AllRoles.MERCHANT]
  })
  role: string;

  @Prop({  type: Types.ObjectId, ref: 'Shop' })
  shopId: string;
}

export const merchantSchema = SchemaFactory.createForClass(Merchant);
