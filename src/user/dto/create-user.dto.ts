import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsEmail,
  IsMobilePhone,
  IsDate,
  IsOptional,
} from 'class-validator';

import { UserRole } from '../schemas/user_schema';
import { Transform } from 'class-transformer';
import { GENDER_STATUS } from 'src/common/enums';

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
  
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsMobilePhone()
  phone: string;

  @IsNotEmpty()
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
