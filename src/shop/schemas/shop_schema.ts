import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define the document type for the shop schema
export type ShopDocument = Shop & Document;

// Define the shop schema
@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class Shop {
  @Prop({ required: true }) // Ensure title is required and unique
  title: string;

  @Prop({ required: true }) // Ensure description is required
  description: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userID: string;

  @Prop({ type: [Types.ObjectId], ref: 'Item' })
  itemsIDs: string[];
}

// Create the Mongoose schema for the Movie class
export const ShopSchema = SchemaFactory.createForClass(Shop);
