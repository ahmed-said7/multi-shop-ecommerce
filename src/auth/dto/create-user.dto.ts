import {
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsEmail,
  IsMobilePhone,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { GENDER_STATUS, UserRole } from 'src/common/enums';

export class CreateUserDto {
  // @IsNotEmpty({ message: i18nValidationMessage("validation.user.name.isNotEmpty")})
  @IsString({ message: i18nValidationMessage('validation.user.name.isString') })
  name: string;
  // @IsNotEmpty({ message: i18nValidationMessage("validation.user.password.isNotEmpty")})
  @IsString({
    message: i18nValidationMessage('validation.user.password.isString'),
  })
  @MinLength(6, {
    message: i18nValidationMessage('validation.user.password.minLength'),
  })
  @MaxLength(25, {
    message: i18nValidationMessage('validation.user.password.maxLength'),
  })
  password: string;
  @IsOptional()
  @IsEnum(UserRole, {
    message: i18nValidationMessage('validation.user.role.isEnum'),
  })
  role: UserRole;
  // @IsNotEmpty({ message : i18nValidationMessage("validation.user.email.isNotEmpty")})
  @IsEmail(
    {},
    { message: i18nValidationMessage('validation.user.email.isEmail') },
  )
  email: string;
  // @IsNotEmpty({ message: i18nValidationMessage("validation.user.phone.isNotEmpty")})
  @IsMobilePhone(
    'ar-EG',
    {},
    { message: i18nValidationMessage('validation.user.phone.isMobilePhone') },
  )
  phone: string;
  // @IsNotEmpty({ message: i18nValidationMessage("validation.user.gender.isNotEmpty")})
  @IsEnum(GENDER_STATUS, {
    message: i18nValidationMessage('validation.user.gender.isEnum'),
  })
  gender: GENDER_STATUS;
  @IsOptional()
  @IsDateString(
    {},
    { message: i18nValidationMessage('validation.user.birthday.isDateString') },
  )
  birthday: string;
}
