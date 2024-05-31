import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

// Define the document type for the shop schema
export type BannerDocument = Banner & Document;

// Define the shop schema
@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class Banner {
  @Prop({ type: String })
  title: string;
  @Prop({ type: String })
  subTitle: string;
  @Prop({ type: String })
  titleAndSubTitlePostion: string;
  @Prop({ type: String })
  titleAndSubTitleColor: string;
  @Prop({ type: String })
  buttonText: string;
  @Prop({ type: String })
  buttonLink: string;
  @Prop({ type: String })
  buttonColor: string;
  @Prop({ type: String })
  buttonTextColor: string;
  @Prop({ type: String })
  buttonPosition: string;
  @Prop({ type: String })
  image: string;

  @Prop({ default: true })
  isContainer: boolean;

  @Prop({ default: true })
  isRounded: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Shop' })
  shopId: mongoose.Types.ObjectId;
}

// Create the Mongoose schema for the Movie class
export const BannerSchema = SchemaFactory.createForClass(Banner);
