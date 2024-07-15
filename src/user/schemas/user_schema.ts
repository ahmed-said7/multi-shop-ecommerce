import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { UserRole } from 'src/common/enums';

import validator from 'validator';

export type Gender = 'male' | 'female' | 'other';




// Define the document type for the user schema
export type UserDocument = HydratedDocument<User>;

// Define the user schema
@Schema({
  timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    enum: [UserRole.ADMIN, UserRole.USER],
    default: UserRole.USER,
  })
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

  @Prop({ default: Date.now().toLocaleString() })
  birthday: string;
}

// Create the Mongoose schema for the user class
export const UserSchema = SchemaFactory.createForClass(User);
