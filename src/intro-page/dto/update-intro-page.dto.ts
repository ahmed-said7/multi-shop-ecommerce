import { PartialType } from '@nestjs/mapped-types';
import { CreateIntroPageDto } from './create-intro-page.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateIntroPageDto extends PartialType(CreateIntroPageDto) {
  @IsOptional()
  @IsString({ message: 'title must be a string' })
  title: string;

  @IsOptional()
  @IsString({ message: 'title must be a string' })
  paragraph: string;
}
