import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";


export type ProductSliderDocument = ProductSlider & Document;

// Define the shop schema
@Schema({
    timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class ProductSlider {

    @Prop({ type: [Types.ObjectId], ref: 'Item' })
    products: Types.Array<string>;
    title: string;
    isSlider: boolean = false;
    @Prop({ type: Types.ObjectId, ref: 'Shop' })
    shop: string;
}

export const ProductSliderSchema = SchemaFactory.createForClass(ProductSlider);