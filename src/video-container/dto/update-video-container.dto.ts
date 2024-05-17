import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoContainerDto } from './create-video-container.dto';
import { IsString } from 'class-validator';

export class UpdateVideoContainerDto extends PartialType(
  CreateVideoContainerDto,
) {
  @IsString({ message: 'link must be a string' })
  link: string;
}
