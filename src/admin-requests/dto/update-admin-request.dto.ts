import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminRequestDto } from './create-admin-request.dto';
import { IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateAdminRequestDto extends PartialType(CreateAdminRequestDto) {
  // @IsOptional()
  // @IsString()
  adminId?: string;
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.admin_request.status.isString'),
  })
  status?: string;
}
