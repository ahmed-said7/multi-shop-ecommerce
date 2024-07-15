import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewContainerDto } from './create-reviewContainer.dto';
import { IsArray, IsMongoId,  IsOptional } from 'class-validator';

export class UpdateReviewContainerDto extends PartialType(
  CreateReviewContainerDto,
) {
  @IsOptional()
  @IsArray()
  @IsMongoId({each:true})
  reviews: string[];
}
