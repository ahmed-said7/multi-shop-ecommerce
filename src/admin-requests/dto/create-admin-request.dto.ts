import { IsNotEmpty, IsArray, IsString, IsEnum } from 'class-validator';
import { Types } from 'mongoose';
import { RequestType } from '../schemas/admin_request_schema';

export class CreateAdminRequestDto {
  @IsString()
  title: string;
  @IsEnum(RequestType, { message: 'Invalid type' })
  type: RequestType;
  @IsString()
  description: string;
  @IsString()
  status: string;
  @IsString()
  info: string;
  @IsString()
  userId: string;
}
