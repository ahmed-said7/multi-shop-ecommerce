import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsEmail,
  IsMobilePhone,
  IsOptional,
  IsDateString,
} from 'class-validator';

import { GENDER_STATUS, UserRole } from 'src/common/enums';

export class CreateUserDto {
  @IsNotEmpty({ message: 'A user must have a name' })
  @IsString({ message: 'A user must have a string name' })
  name: string;
  @IsNotEmpty({ message: 'A user must have a password' })
  @IsString({ message: 'A user must have a string password' })
  @MinLength(6, { message: 'A user password must be 6 chracters minimum' })
  @MaxLength(25, { message: 'A user password must be 25 chracters maximum' })
  password: string;

  @IsOptional({ message: 'A user must have a role' })
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
  @IsDateString()
  birthday: string;
}
