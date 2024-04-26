import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type PhotoSlideDocument = PhotoSlide & Document;


@Schema({
  timestamps: true,
})
export class PhotoSlide {
  @Prop()
  title: string;
  @Prop()
  subTitle: string;
  @Prop()
  titleAndSubTitlePostion: string;
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
  buttonPosition: string;
  @Prop()
  photo: string;
  @Prop({ type: Types.ObjectId, ref: 'PhotoSlider' })
  photoSlider: mongoose.Types.ObjectId;
}

export const PhotoSlideSchema = SchemaFactory.createForClass(PhotoSlide);
