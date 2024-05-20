import { IsOptional, IsString, IsEnum, IsNotEmpty } from 'class-validator';

import { UserRole } from '../schemas/user_schema';
import { Types } from 'mongoose';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto implements Partial<CreateUserDto> {
  @IsOptional()
  @IsString({ message: 'A user must have a string title' })
  name?: string;

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

  orders?: Types.ObjectId[];

  cart?: Types.ObjectId[];

  wishList?: Types.ObjectId[];

  gender: 'male' | 'female';

  birthday: string;
}
