import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewContainerDto } from './create-reviewContainer.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateReviewContainerDto extends PartialType(
  CreateReviewContainerDto,
) {
  @IsNotEmpty({ message: 'A review container must have a refrence review' })
  reviews: string[];
}
