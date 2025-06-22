import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginUserDto {
  @IsEmail(
    {},
    { message: i18nValidationMessage('validation.user.email.isEmail') },
  )
  @IsNotEmpty({
    message: i18nValidationMessage('validation.user.email.isNotEmpty'),
  })
  email: string;
  @IsString({
    message: i18nValidationMessage('validation.user.password.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.user.password.isNotEmpty'),
  })
  password: string;
}
