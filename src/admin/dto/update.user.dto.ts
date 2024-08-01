import { IsEnum, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { UserRole } from 'src/common/enums';

export class UpdateUserByAdminDto {
  @IsOptional()
  @IsEnum(UserRole, {
    message: i18nValidationMessage('validation.user.role.isEnum'),
  })
  role: UserRole;
}
