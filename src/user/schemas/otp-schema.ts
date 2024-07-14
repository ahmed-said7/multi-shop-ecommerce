import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, expires: 600000 })
export class Otp {
  @Prop({ required: true, unique: true , type:Number })
  number: number;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
