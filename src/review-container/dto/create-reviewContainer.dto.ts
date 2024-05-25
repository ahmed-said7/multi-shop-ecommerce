import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateReviewContainerDto {
  @IsNotEmpty({ message: 'review container must have a refrence review' })
  review: string[];
}
