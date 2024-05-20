import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  ArrayUnique,
  IsNotEmpty,
} from 'class-validator';

import {
  ReadyOption,
  UserExperienceType,
  UserRole,
} from '../schemas/user_schema';
import { Types } from 'mongoose';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto implements Partial<CreateUserDto> {
  @IsOptional()
  @IsString({ message: 'A user must have a string title' })
  name?: string;

  @IsNotEmpty({ message: 'Please send the ID of the user you want to update' })
  @IsString()
  currentId: string;

  @IsNotEmpty({ message: 'Please send the ID of the user you want to update' })
  @IsString()
  updateId: string;

  @IsOptional()
  @IsString({ message: 'A user must have a string password' })
  password?: string;

  shop?: Types.ObjectId;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid user role' })
  role?: UserRole;

  @IsOptional()
  @IsString({ message: 'Invalid email' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Invalid phone number format' })
  phone?: string;

  wallet?: number;

  orders?: Types.ObjectId[];

  cart?: Types.ObjectId[];

  wishList?: Types.ObjectId[];

  twitter?: string;

  facebook?: string;

  instagram?: string;

  gender: 'male' | 'female';

  birthday: string;
}
