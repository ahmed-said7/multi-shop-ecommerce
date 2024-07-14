import { IsDate, IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { GENDER_STATUS } from 'src/common/enums';
import { Transform } from 'class-transformer';

export class CreateMerchantDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  @IsMobilePhone()
  phone: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
  
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
  birthday: Date;
}
