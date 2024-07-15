import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ThemeType } from 'src/common/enums';

// Define the document type for the theme schema
export type ThemeDocument = Theme & Document;

// Define the theme schema
@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class Theme {
  @Prop({ type: String, enum: Object.values(ThemeType), required: true })
  title: ThemeType;

  @Prop()
  description: string;

  @Prop({ required: true })
  createdBy: string;
}

// Create the Mongoose schema for the Theme class
export const ThemeSchema = SchemaFactory.createForClass(Theme);
