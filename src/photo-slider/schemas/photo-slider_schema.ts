import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

// Define the document type for the shop schema
export type PhotoSliderDocument = PhotoSlider & Document;

// Define the shop schema
@Schema({
    timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class PhotoSlider {
    @Prop({ type: [mongoose.Types.ObjectId], ref: 'PhotoSlide' })
    photoSlides: mongoose.Types.ObjectId[]

    @Prop({ type: Types.ObjectId, ref: 'Shop' })
    shop: mongoose.Types.ObjectId;
}

// Create the Mongoose schema for the Movie class
export const PhotoSliderSchema = SchemaFactory.createForClass(PhotoSlider);
