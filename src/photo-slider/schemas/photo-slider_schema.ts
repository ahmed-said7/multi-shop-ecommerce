import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

// Define the document type for the shop schema
export type PhotoSliderDocument = PhotoSlider & Document;

// Define the shop schema
@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class PhotoSlider {
  @Prop({})
  photoSlides: [
    {
      title: string;
      subTitle: string;
      titleAndSubTitlePosition: string;
      titleAndSubTitleColor: string;
      buttonText: string;
      buttonLink: string;
      buttonColor: string;
      buttonTextColor: string;
      buttonPosition: string;
      photo: string;
    },
  ];

  // @Prop({ default: true })
  // isRounded: boolean;

  // @Prop({ default: true })
  // isContainer: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Shop' })
  shopId: mongoose.Types.ObjectId;
}

// Create the Mongoose schema for the Movie class
export const PhotoSliderSchema = SchemaFactory.createForClass(PhotoSlider);
