import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class CartItem {
  @Prop()
  itemId: string;

  @Prop()
  shopId: string;

  @Prop()
  userId: string;

  @Prop()
  quantity: number;

  @Prop({ default: [] })
  sizes: string[];

  @Prop({ default: [] })
  colors: string[];
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
