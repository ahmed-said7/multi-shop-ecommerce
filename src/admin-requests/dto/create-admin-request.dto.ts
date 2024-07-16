import { IsNotEmpty, IsArray, IsString, IsEnum, IsOptional } from 'class-validator';
import { RequestType } from 'src/common/enums';

export class CreateAdminRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsEnum(RequestType, { message: 'Invalid type' })
  type: RequestType;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsString()
  status: string;
  @IsNotEmpty()
  @IsString()
  info: string;
  // @IsOptional()
  // @IsString()
  userId: string;
}
