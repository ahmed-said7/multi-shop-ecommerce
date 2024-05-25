import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  rating: number;

  description: string;

  shopId: Types.ObjectId;

  user: Types.ObjectId;
  item: string;
  title: string;
}
