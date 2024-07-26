import { IsNotEmpty, IsArray, IsString, IsEnum, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { RequestType } from 'src/common/enums';
// admin_request
export class CreateAdminRequestDto {
  // @IsNotEmpty({ message: i18nValidationMessage("validation.admin_request.title.isNotEmpty")})
  @IsString({ message: i18nValidationMessage("validation.admin_request.title.isString")})
  title: string;
  // @IsNotEmpty({ message: i18nValidationMessage("validation.admin_request.type.isNotEmpty")})
  @IsEnum(RequestType, { message: i18nValidationMessage("validation.admin_request.type.isString")})
  type: RequestType;
  // @IsNotEmpty({ message: i18nValidationMessage("validation.admin_request.description.isNotEmpty")})
  @IsString({ message: i18nValidationMessage("validation.admin_request.description.isString")})
  description: string;
  // @IsNotEmpty({ message: i18nValidationMessage("validation.admin_request.status.isNotEmpty")})
  @IsString({ message: i18nValidationMessage("validation.admin_request.status.isString")})
  status: string;
  // @IsNotEmpty({ message: i18nValidationMessage("validation.admin_request.info.isNotEmpty")})
  @IsString({ message: i18nValidationMessage("validation.admin_request.info.isString")})
  info: string;
  // @IsOptional()
  // @IsString()
  userId: string;
}
