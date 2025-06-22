import { IsArray, IsMongoId } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateReviewContainerDto {
  // @IsNotEmpty({message:i18nValidationMessage("validation.reviewContainer.reviews.isNotEmpty")})
  @IsArray({
    message: i18nValidationMessage(
      'validation.reviewContainer.reviews.isArray',
    ),
  })
  @IsMongoId({
    each: true,
    message: i18nValidationMessage(
      'validation.reviewContainer.reviews.isMongoId',
    ),
  })
  reviews: string[];
}
