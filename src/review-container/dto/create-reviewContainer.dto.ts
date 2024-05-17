import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateReviewContainerDto {
  @IsNotEmpty({ message: 'Review container must have its shop Id' })
  shop: string;

  @IsNotEmpty({ message: 'review container must have a refrence review' })
  review: string[];
}
