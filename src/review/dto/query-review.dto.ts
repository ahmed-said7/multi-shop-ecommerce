import { IsMongoId, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { FindQuery } from 'src/common/enums';

export class QueryReviewDto extends FindQuery {
  @IsOptional()
  rating: string | object;
  @IsOptional()
  @IsMongoId({
    message: i18nValidationMessage('validation.review.user.isMongoId'),
  })
  user: string;
  @IsOptional()
  @IsMongoId()
  shopId: string;
  @IsOptional()
  @IsMongoId()
  item: string;
}
