import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoContainerDto } from './create-video-container.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateVideoContainerDto extends PartialType(
  CreateVideoContainerDto,
) {
  @IsOptional()
  @IsString({ message: 'link must be a string' })
  link: string;
}
