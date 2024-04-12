import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VideoContainerDocument = VideoContainer & Document;

@Schema({
  timestamps: true,
})
export class VideoContainer {
  @Prop()
  link: string;

  @Prop({ type: Types.ObjectId, ref: 'Shop' })
  shop: string;
}

export const VideoContainerSchema =
  SchemaFactory.createForClass(VideoContainer);
