import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, Types } from 'mongoose';

export type IntroPageDocument = IntroPage & Document;

@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class IntroPage {
  @Prop()
  title: string;
  @Prop()
  paragraph: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Shop' })
  @IsNotEmpty()
  @IsString()
  shopId: Types.ObjectId;
}

export const IntroPageSchema = SchemaFactory.createForClass(IntroPage);
