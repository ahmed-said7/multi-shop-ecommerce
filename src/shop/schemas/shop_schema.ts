import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define the document type for the shop schema
export type ShopDocument = Shop & Document;

// Define the shop schema
@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class Shop {
  @Prop({ required: true }) // Ensure title is required and unique
  title: string;

  @Prop({ type:String,default: 'default text' }) // Ensure description is required
  description: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'User' })
  userID: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Item', default: [] })
  itemsIDs: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  customers: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Category', default: [] })
  categories: Types.ObjectId[];

  @Prop({
    type: [
      {
        containerID: {
          type: Types.ObjectId,
          refPath: 'containers.containerType',
        },
        containerType: {
          type: String,
          required: true,
          enum: [
            'VideoContainer',
            'ProductSlider',
            'Banner',
            'ReviewContainer',
            'PhotoSlider',
          ],
        },
      },
    ],
    default: [],
  })
  containers: { containerID: Types.ObjectId; containerType: string }[];
  @Prop({ default: [] })
  introPages: string[];

  @Prop()
  twitter: string;

  @Prop()
  facebook: string;

  @Prop()
  instagram: string;

  @Prop()
  whatsapp?: string;

  @Prop()
  logo: string;
}

// Create the Mongoose schema for the Movie class
export const ShopSchema = SchemaFactory.createForClass(Shop);
