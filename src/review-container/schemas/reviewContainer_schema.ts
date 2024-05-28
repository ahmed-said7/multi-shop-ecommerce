import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ReviewContainerDocument = ReviewContainer & Document;

// Define the shop schema
@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class ReviewContainer {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Shop' })
  shopId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Review' })
  reviews: string[];
}

export const ReviewContainerSchema =
  SchemaFactory.createForClass(ReviewContainer);
