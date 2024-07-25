import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class AddToCartDto {
  shopId: string;
  @IsNotEmpty({message:i18nValidationMessage("validation.cart.itemId.isNotEmpty")})
  @IsMongoId({message:i18nValidationMessage("validation.cart.itemId.isMongoId")})
  itemId: string;
  @IsOptional()
  @IsNumber({},{message:i18nValidationMessage("validation.cart.quantity.isNumber")})
  quantity: number;
  @IsOptional()
  @IsString({message:i18nValidationMessage("validation.cart.size.isString")})
  size?: string;
  @IsNotEmpty({message:i18nValidationMessage("validation.cart.color.isNotEmpty")})
  @IsString({message:i18nValidationMessage("validation.cart.color.isString")})
  color: string;
};
