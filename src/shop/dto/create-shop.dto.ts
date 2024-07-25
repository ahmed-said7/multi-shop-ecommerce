import { IsNotEmpty, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateShopDto {
  // Shop title, must not be empty, and should be a string
  @IsNotEmpty({ message: i18nValidationMessage("validation.shop.title.isNotEmpty") })
  @IsString({ message: i18nValidationMessage("validation.shop.title.isString") })
  title: string;

  // Shop description, must not be empty, and should be a string
  @IsNotEmpty({ message: i18nValidationMessage("validation.shop.description.isNotEmpty") })
  @IsString({ message: i18nValidationMessage("validation.shop.description.isString") })
  @MinLength(10, { message: i18nValidationMessage("validation.shop.description.minLength") })
  @MaxLength(150, { message: i18nValidationMessage("validation.shop.description.maxLength") })
  description: string;
  
  @IsOptional()
  @IsString({ message: i18nValidationMessage("validation.shop.twitter.isString") })
  twitter?: string;
  
  @IsOptional()
  @IsString({ message: i18nValidationMessage("validation.shop.facebook.isString") })
  facebook?: string;
  
  @IsOptional()
  @IsString({ message: i18nValidationMessage("validation.shop.instagram.isString") })
  instagram?: string;
  
  @IsOptional()
  @IsString({ message: i18nValidationMessage("validation.shop.whatsapp.isString") })
  whatsapp?: string;
}
