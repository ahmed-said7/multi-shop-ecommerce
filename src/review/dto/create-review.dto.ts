import { IsMongoId, IsNotEmpty, IsNumber,  IsString, Max, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateReviewDto {
  @IsNotEmpty({ message: i18nValidationMessage("validation.review.rating.isNotEmpty") })
  @IsNumber({},{ message: i18nValidationMessage("validation.review.rating.isNumber") })
  @Min(1)
  @Max(5)
  rating: number;
  shopId: string;
  user: string;
  @IsNotEmpty({ message: i18nValidationMessage("validation.review.item.isNotEmpty") })
  @IsMongoId({ message: i18nValidationMessage("validation.review.item.isMongoId") })
  item: string;
  @IsNotEmpty({ message: i18nValidationMessage("validation.review.title.isNotEmpty") })
  @IsString({ message: i18nValidationMessage("validation.review.title.isString") })
  title: string;
};
