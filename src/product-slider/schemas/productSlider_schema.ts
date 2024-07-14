import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ProductSliderDocument = ProductSlider & Document;

// Define the shop schema
@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class ProductSlider {
  @Prop({ type: [Types.ObjectId], ref: 'Item' })
  products: Types.ObjectId[];
  @Prop()
  title: string;
  @Prop({ type:Boolean , default: false })
  isSlider: boolean;
  @Prop({ type: Types.ObjectId, ref: 'Shop' })
  shopId: Types.ObjectId;
}

export const ProductSliderSchema = SchemaFactory.createForClass(ProductSlider);
