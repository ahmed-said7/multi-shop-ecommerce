import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define the document type for the shop schema
export type PhotoSliderDocument = PhotoSlider & Document;

// Define the shop schema
@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class PhotoSlider {
  @Prop()
  title: string;
  @Prop()
  subTitle: string;
  @Prop()
  titleAndSubTitlePostion: number;
  @Prop()
  titleAndSubTitleColor: string;
  @Prop()
  buttonText: string;
  @Prop()
  buttonLink: string;
  @Prop()
  buttonColor: string;
  @Prop()
  buttonTextColor: string;
  @Prop()
  buttonPosition: number;
  @Prop()
  photos: string;
  @Prop({ unique: true })
  containerName: string;
  @Prop()
  isContainer: boolean;
  @Prop()
  isSlider: boolean;
  @Prop({ type: Types.ObjectId, ref: 'Shop' })
  shop: string;
}

export const PhotoSliderSchema = SchemaFactory.createForClass(PhotoSlider);
