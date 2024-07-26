import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateItemDto {
  // @IsNotEmpty({ message: i18nValidationMessage("validation.item.name.isNotEmpty") })
  @IsString({ message: i18nValidationMessage("validation.item.name.isString") })
  name: string;
  // @IsNotEmpty({ message: i18nValidationMessage("validation.item.price.isNotEmpty") })
  @IsNumber({},{ message: i18nValidationMessage("validation.item.price.isNumber") })
  price: number;
  // @IsNotEmpty({ message: i18nValidationMessage("validation.item.amount.isNotEmpty") })
  @IsNumber({},{ message: i18nValidationMessage("validation.item.amount.isNumber") })
  amount: number;
  // @IsNotEmpty({ message: i18nValidationMessage("validation.item.description.isNotEmpty") })
  @IsString({ message: i18nValidationMessage("validation.item.description.isString") })
  description: string;
  // @IsNotEmpty({ message: i18nValidationMessage("validation.item.category.isNotEmpty") })
  @IsMongoId({ message: i18nValidationMessage("validation.item.category.isMongoId") })
  category: string;
  @IsOptional()
  @IsArray({ message: i18nValidationMessage("validation.item.sizes.isArray") })
  @IsString({ each:true , message: i18nValidationMessage("validation.item.sizes.isString") })
  sizes?: string[];
  @IsOptional()
  @IsArray({ message: i18nValidationMessage("validation.item.images.isArray") } )
  @IsString({ each:true ,  message: i18nValidationMessage("validation.item.images.isString") })
  images?: string[];
  @IsOptional()
  @IsArray({ message: i18nValidationMessage("validation.item.colors.isArray") } )
  @IsString({ each:true ,  message: i18nValidationMessage("validation.item.colors.isString") })
  colors?: string[];
  @IsOptional()
  @IsNumber({},{ message : i18nValidationMessage("validation.item.soldTimes.isNumber") } )
  soldTimes?: number;
}
