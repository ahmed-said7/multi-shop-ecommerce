import { IsDateString, IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { GENDER_STATUS } from 'src/common/enums';

export class CreateMerchantDto {
  @IsNotEmpty({ message:i18nValidationMessage("validation.merchant.name.isNotEmpty") })
  @IsString({ message:i18nValidationMessage("validation.merchant.name.isString") })
  name: string;
  @IsNotEmpty({ message:i18nValidationMessage("validation.merchant.email.isNotEmpty") })
  @IsString({ message:i18nValidationMessage("validation.merchant.email.isString") })
  @IsEmail({},{ message:i18nValidationMessage("validation.merchant.email.isEmail") })
  email: string;
  @IsNotEmpty({ message:i18nValidationMessage("validation.merchant.phone.isNotEmpty") })
  @IsString({ message:i18nValidationMessage("validation.merchant.phone.isString") })
  @IsMobilePhone("ar-EG",{},{ message:i18nValidationMessage("validation.merchant.phone.isMobilePhone") })
  phone: string;
  @IsNotEmpty({ message:i18nValidationMessage("validation.merchant.password.isNotEmpty") })
  @IsString({ message:i18nValidationMessage("validation.merchant.password.isString") })
  @MinLength(6,{ message:i18nValidationMessage("validation.merchant.password.minLength") })
  password: string;
  
  @IsNotEmpty({ message:i18nValidationMessage("validation.merchant.gender.isNotEmpty") })
  @IsEnum(GENDER_STATUS,{ message:i18nValidationMessage("validation.merchant.gender.isEnum") })
  gender: GENDER_STATUS;
  

  @IsOptional()
  @IsDateString({},{ message:i18nValidationMessage("validation.merchant.birthday.isDateString") })
  birthday: Date;
}
