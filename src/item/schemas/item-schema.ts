import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type ItemDocument = Item & Document;

@Schema({
  timestamps: true
})
export class Item {
  @Prop({ type:String, required: true })
  name: string;

  @Prop({ type:String,required: true, min: 0 })
  price: number;

  @Prop({ type:String , required: true, min: 0 })
  amount: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Shop' })
  shopId: Types.ObjectId;

  @Prop({ type:String, required: true })
  description: string;

  @Prop({
    required: true,
    type: Types.ObjectId, ref: 'Category' 
  })
  category: Types.ObjectId;

  // @Prop()
  // brand: string;

  @Prop({ type:Number , min: 0, max: 5 })
  rating?: number;

  @Prop()
  sizes: string[];

  @Prop()
  images: string[];

  @Prop()
  colors: string[];

  @Prop({ default: 0 })
  soldTimes: number;
}

// Create the Mongoose schema for the user class
export const ItemSchema = SchemaFactory.createForClass(Item);
