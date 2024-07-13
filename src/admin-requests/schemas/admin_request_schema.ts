import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, Types } from 'mongoose';
import { RequestType } from 'src/common/enums';

export type AdminRequestDocument = AdminRequest & Document;
// export enum RequestType {
//   SHOP = 'Shop',
//   DESIGN = 'Design',
// }
@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class AdminRequest {
  @Prop()
  title: string;
  @Prop({ enum: RequestType })
  type: RequestType;
  @Prop()
  description: string;
  @Prop()
  status: string;
  @Prop()
  info: string;
  @Prop()
  adminId?: string;
  @Prop()
  userId: string;
}

export const AdminRequestSchema = SchemaFactory.createForClass(AdminRequest);
