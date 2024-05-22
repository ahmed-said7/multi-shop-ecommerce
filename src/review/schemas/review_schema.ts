import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class Review {
  @Prop({ required: true })
  rating: number;
  @Prop({ required: true })
  description: string;
  @Prop({ type: Types.ObjectId, ref: 'Item' })
  item: string;
  @Prop({ required: true })
  title: string;
  @Prop({ type: Types.ObjectId, ref: 'Shop' })
  shopId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
