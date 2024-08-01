import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateProductSliderDto {
  @IsOptional()
  @IsArray({
    message: i18nValidationMessage('validation.productSlider.products.isArray'),
  })
  @IsMongoId({
    each: true,
    message: i18nValidationMessage(
      'validation.productSlider.products.isMongoId',
    ),
  })
  products: string[];
  // @IsNotEmpty({message:i18nValidationMessage("validation.productSlider.title.isNotEmpty")})
  @IsString({
    message: i18nValidationMessage('validation.productSlider.title.isString'),
  })
  title: string;
  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage(
      'validation.productSlider.isSlider.isBoolean',
    ),
  })
  isSlider: boolean;
}
