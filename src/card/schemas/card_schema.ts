import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define the document type for the shop schema
export type CardDocument = Card & Document;

// Define the shop schema
@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class Card {
  @Prop()
  link: string;
  @Prop()
  photo: string;
  @Prop()
  buttonLink: string;
  @Prop()
  buttonTitle: string;
  @Prop()
  title: string;
  @Prop({ type: Types.ObjectId, ref: 'Shop' })
  shop: string;
  @Prop({ type: Types.ObjectId, ref: 'CardSlider' })
  cardSlider: string;
}

// Create the Mongoose schema for the Movie class
export const CardSchema = SchemaFactory.createForClass(Card);
