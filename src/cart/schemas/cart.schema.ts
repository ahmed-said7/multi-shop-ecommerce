import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Cart extends Document {
  @Prop([
    {
      item: { type: Types.ObjectId, ref: 'Item' },
      quantity: { type: Number },
      sizes: { type: String },
      colors: { type: String },
    },
  ])
  items: {
    item: Types.ObjectId;
    quantity: number;
    sizes: string;
    colors: string;
  }[];

  @Prop({ required: true })
  shopId: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
