import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminRequestDto } from './create-admin-request.dto';
import { IsOptional, IsString } from 'class-validator';
import { Prop } from '@nestjs/mongoose';

export class UpdateAdminRequestDto extends PartialType(CreateAdminRequestDto) {
  // @IsOptional()
  // @IsString()
  adminId?: string;
  @IsOptional()
  @IsString()
  status?: string;
}
