import { IsString, MinLength, MaxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateCategoryDto {
  // Category title, must not be empty, and should be a string
  // @IsNotEmpty({ message:i18nValidationMessage("validation.category.title.isNotEmpty") })
  @IsString({
    message: i18nValidationMessage('validation.category.title.isString'),
  })
  @MinLength(3, {
    message: i18nValidationMessage('validation.category.title.minLength'),
  })
  @MaxLength(20, {
    message: i18nValidationMessage('validation.category.title.maxLength'),
  })
  title: string;

  // @IsNotEmpty({ message:i18nValidationMessage("validation.category.image.isNotEmpty") })
  @IsString({
    message: i18nValidationMessage('validation.category.image.isString'),
  })
  image: string;
}
