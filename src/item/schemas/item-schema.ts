import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define the document type for the user schema
export type ItemDocument = Item & Document;

// Define the user schema
@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Shop' })
  shopId: Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, ref: 'Category' }],
  })
  category: Types.ObjectId[];

  @Prop()
  brand: string;

  @Prop({ min: 0, max: 5 })
  rating?: number;

  @Prop()
  sizes: string[];

  @Prop()
  images: string[];

  @Prop()
  colors: string[];

  @Prop()
  subCategories: string[];

  @Prop()
  priceAfter: number;

  @Prop({ default: 0 })
  soldTimes: number;
}

// Create the Mongoose schema for the user class
export const ItemSchema = SchemaFactory.createForClass(Item);
