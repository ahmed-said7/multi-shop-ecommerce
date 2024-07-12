import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsEmail,
  IsMobilePhone,
  IsDate
} from 'class-validator';

import { UserRole } from '../schemas/user_schema';
import { Transform } from 'class-transformer';
import { GENDER_STATUS } from 'src/common/enums';

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
  @Transform( ({ value }) => {
    if( value ){
      return new Date(value);
    };
  })
  @IsDate()
  birthday: string;
}
