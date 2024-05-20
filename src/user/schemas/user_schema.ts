import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import validator from 'validator';

// Enum for user roles
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  SHOP_OWNER = 'shop_owner',
}

export enum UserExperienceType {
  STORE = 'store',
  SOCIALMEDIA = 'social_media',
}

export enum ReadyOption {
  PRODUCTS = 'products',
  DESIGN = 'design',
  STATEMENTS = 'statements',
  PAYMENTS = 'payments',
  LOGISTICS = 'logistics',
  DIGITAL_MARKETING = 'digital_marketing',
}

// Define the document type for the user schema
export type UserDocument = User & Document;

// Define the user schema
@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class User {
  @Prop({ required: true }) // Ensure name is required
  name: string;

  @Prop({ required: true }) // Ensure password is required
  password: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.USER }) // Add the role property
  role: UserRole;

  @Prop({
    required: true,
    unique: true,
    validate: [
      (v: string) => validator.isEmail(v),
      'Please Enter A Valid Email',
    ],
  })
  email: string;

  @Prop({ unique: true })
  phone: string;

  @Prop({ type: Types.ObjectId, ref: 'Shop' })
  shop: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  reviews: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Order' })
  orders: Types.ObjectId[];

  @Prop({ default: 0 })
  wallet: number;

  @Prop({ type: [Types.ObjectId], ref: 'Item' })
  cart: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Item' })
  wishList: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Item', default: [] })
  favorites?: Types.ObjectId[];

  @Prop({ enum: ['male', 'female'] })
  gender: string;
}

// Create the Mongoose schema for the user class
export const UserSchema = SchemaFactory.createForClass(User);
