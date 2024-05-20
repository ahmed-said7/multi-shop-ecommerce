import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsEmail,
  Matches,
} from 'class-validator';

import { UserRole } from '../schemas/user_schema';
import { Types } from 'mongoose';

export class CreateUserDto {
  // Shop title, must not be empty, and should be a string
  @IsNotEmpty({ message: 'A user must have a name' })
  @IsString({ message: 'A user must have a string name' })
  name: string;

  // User password, must not be empty, and should be a valid date string
  @IsNotEmpty({ message: 'A user must have a password' })
  @IsString({ message: 'A user must have a string password' })
  @MinLength(6, { message: 'A user password must be 6 chracters minimum' })
  @MaxLength(25, { message: 'A user password must be 25 chracters maximum' })
  password: string;

  // User Role, must not be empty and should be of the current options
  @IsNotEmpty({ message: 'A user must have a role' })
  @IsEnum(UserRole, { message: 'Invalid user role' })
  role: UserRole;

  @IsEmail()
  email: string;

  @Matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, {
    message: 'Invalid phone number format',
  })
  phone: string;

  shop: Types.ObjectId;

  wallet: number;

  orders: Types.ObjectId[];

  cart: Types.ObjectId[];

  wishList: Types.ObjectId[];

  favorites?: Types.ObjectId[];

  twitter: string;

  facebook: string;

  instagram: string;

  gender: 'male' | 'female';
}
