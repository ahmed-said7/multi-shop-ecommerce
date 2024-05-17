import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReportsDocument = Reports & Document;

@Schema({
  timestamps: true,
})
export class Reports {
  @Prop({ type: Map, of: Number, default: {} })
  monthlySales: Map<string, number>;

  @Prop({
    type: [
      { itemID: { type: Types.ObjectId, ref: 'Item' }, totalSales: Number },
    ],
    default: [],
  })
  itemsSales: Types.Array<{ itemID: string; totalSales: number }>;

  @Prop({
    type: [{ clientID: { type: Types.ObjectId, ref: 'User' }, rating: Number }],
    default: [],
  })
  clientRatings: Types.Array<{ clientID: string; rating: number }>;

  @Prop({ type: Map, of: Number, default: {} })
  highOrderDays: Map<string, number>;

  @Prop({ type: Map, of: Number, default: {} })
  highOrderMonths: Map<string, number>;
}

export const ReportsSchema = SchemaFactory.createForClass(Reports);
