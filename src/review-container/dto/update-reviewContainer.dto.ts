import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewContainerDto } from './create-reviewContainer.dto';

export class UpdateReviewContainerDto extends PartialType(
  CreateReviewContainerDto,
) {}
