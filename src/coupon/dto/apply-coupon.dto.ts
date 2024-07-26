import {
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class applyCoupon {
  // @IsNotEmpty({ message:i18nValidationMessage("validation.coupon.text.isNotEmpty") })
  @IsString({ message:i18nValidationMessage("validation.coupon.text.isString") })
  text: string;
  
  // @IsNotEmpty({ message:i18nValidationMessage("validation.coupon.shopId.isNotEmpty") })
  @IsMongoId({ message:i18nValidationMessage("validation.coupon.shopId.isMongoId") })
  shopId: string;
}
