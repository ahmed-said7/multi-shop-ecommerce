import { IsMongoId, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { FindQuery } from 'src/common/enums';
export class QueryRequestDto extends FindQuery {
  @IsOptional()
  @IsMongoId({
    message: i18nValidationMessage('validation.admin_request.userId.isMongoId'),
  })
  userId: string;
  @IsOptional()
  type: string;
  @IsOptional()
  status: string;
  @IsOptional()
  @IsMongoId()
  adminId: string;
}
