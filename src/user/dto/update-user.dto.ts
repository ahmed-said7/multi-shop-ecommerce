import {
  IsOptional,
  IsString,
  IsEnum,
  IsEmail,
  IsMobilePhone,
  IsDate,
  IsDateString
} from 'class-validator';

import { Transform } from 'class-transformer';
import { GENDER_STATUS, UserRole } from 'src/common/enums';

export class UpdateUserDto {
  // Shop title, must not be empty, and should be a string
  @IsOptional()
  @IsString({ message: 'A user must have a string name' })
  name: string;

  // User Role, must not be empty and should be of the current options
  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid user role' })
  role: UserRole;
  
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsMobilePhone()
  phone: string;

  @IsOptional()
  @IsEnum(GENDER_STATUS)
  gender: GENDER_STATUS;
  

  @IsOptional()
  @IsDateString()
  birthday: string;
}
