import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define the document type for the Category schema
export type CategoryDocument = Category & Document;

// Define the Category schema
@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class Category {
  @Prop({ required: true }) // Ensure title is required and unique
  title: string;

  @Prop({ type: [String], default: [] }) // Set type to array of strings
  subCategory: string[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'Shop' })
  shopId: Types.ObjectId;
}

// Create the Mongoose schema for the Movie class
export const CategorySchema = SchemaFactory.createForClass(Category);
