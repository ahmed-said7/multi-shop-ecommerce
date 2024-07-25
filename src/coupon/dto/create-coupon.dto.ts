import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateCouponDto {
  @IsNotEmpty({ message:i18nValidationMessage("validation.coupon.text.isNotEmpty") })
  @IsString({ message:i18nValidationMessage("validation.coupon.text.isString") })
  text: string;
  @IsOptional()
  @IsDateString({},{ message:i18nValidationMessage("validation.coupon.endDate.isDateString") })
  endDate: Date;
  @IsOptional()
  @IsNumber( {} , { message :i18nValidationMessage("validation.coupon.discountPercentage.isNumber") })
  numOfTimes: number;
  @IsNotEmpty({ message:i18nValidationMessage("validation.coupon.text.isNotEmpty") })
  @IsNumber( {} , { message :i18nValidationMessage("validation.coupon.discountPercentage.isNumber") })
  discountPercentage: number;
}
