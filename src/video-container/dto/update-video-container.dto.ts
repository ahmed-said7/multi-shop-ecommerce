import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoContainerDto } from './create-video-container.dto';

export class UpdateVideoContainerDto extends PartialType(
  CreateVideoContainerDto,
) {}
