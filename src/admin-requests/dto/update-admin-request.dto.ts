import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminRequestDto } from './create-admin-request.dto';
import { IsString } from 'class-validator';
import { Prop } from '@nestjs/mongoose';

export class UpdateAdminRequestDto extends PartialType(CreateAdminRequestDto) {
  @Prop()
  adminId?: string;
  @IsString()
  status?: string;
}
