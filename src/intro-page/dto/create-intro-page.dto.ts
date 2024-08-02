import { IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateIntroPageDto {
  // @IsNotEmpty({ message:i18nValidationMessage("validation.introPage.title.isNotEmpty")})
  @IsString({
    message: i18nValidationMessage('validation.introPage.title.isString'),
  })
  title: string;

  // @IsNotEmpty({ message:i18nValidationMessage("validation.introPage.paragraph.isNotEmpty")})
  @IsString({
    message: i18nValidationMessage('validation.introPage.paragraph.isString'),
  })
  paragraph: string;
}
