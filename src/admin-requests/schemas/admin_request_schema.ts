import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RequestType } from 'src/common/enums';

export type AdminRequestDocument = AdminRequest & Document;
@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class AdminRequest {
  @Prop({ type:String })
  title: string;
  @Prop({ type:String,enum: Object.values(RequestType) })
  type: RequestType;
  @Prop({ type:String })
  description: string;
  @Prop({ type:String })
  status: string;
  @Prop({ type:String })
  info: string;
  @Prop({ type:Types.ObjectId ,  ref:"User" })
  adminId?: string;
  @Prop({ type:Types.ObjectId ,  ref:"User" })
  userId?: string;
}

export const AdminRequestSchema = SchemaFactory.createForClass(AdminRequest);
