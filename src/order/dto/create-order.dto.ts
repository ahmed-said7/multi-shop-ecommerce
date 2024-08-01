import {
  IsNotEmpty,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
  IsMobilePhone,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ValidateAddresse {
  // @IsNotEmpty({ message:i18nValidationMessage("validation.addresse.city.isNotEmpty") })
  @IsString({
    message: i18nValidationMessage('validation.addresse.city.isNotEmpty'),
  })
  city?: string;
  // @IsNotEmpty({ message:i18nValidationMessage("validation.addresse.mobile.isNotEmpty") })
  @IsString({
    message: i18nValidationMessage('validation.addresse.mobile.isString'),
  })
  @IsMobilePhone(
    'ar-EG',
    {},
    {
      message: i18nValidationMessage(
        'validation.addresse.mobile.isMobilePhone',
      ),
    },
  )
  mobile?: string;
  // @IsNotEmpty({ message:i18nValidationMessage("validation.addresse.streetName.isNotEmpty") })
  @IsString({
    message: i18nValidationMessage('validation.addresse.streetName.isString'),
  })
  streetName?: string;
  @IsOptional()
  @IsNumber(
    {},
    { message: i18nValidationMessage('validation.addresse.zipCode.isNumber') },
  )
  zipCode?: number;
  // @IsNotEmpty({ message:i18nValidationMessage("validation.addresse.country.isNotEmpty") })
  @IsString({
    message: i18nValidationMessage('validation.addresse.country.isString'),
  })
  country?: string;
}

export class CreateOrderDto {
  // @IsNotEmpty({ message:i18nValidationMessage("validation.order.shopId.isNotEmpty") })
  @IsMongoId({
    message: i18nValidationMessage('validation.order.shopId.isMongoId'),
  })
  shopId: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.order.userAddresse.isNotEmpty'),
  })
  @ValidateNested()
  @Type(() => ValidateAddresse)
  userAddresse?: {
    city?: string;
    country?: string;
    streetName?: string;
    zipCode?: number;
    mobile: string;
  };

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.order.couponName.isString'),
  })
  couponName: string;

  cartItems: {
    product: Types.ObjectId;
    quantity: number;
    size: string;
    color: string;
  }[];
  priceTotal: number;
}
