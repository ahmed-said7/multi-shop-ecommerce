import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'A review must have a rating!' })
  rating: number;
  @IsNotEmpty({ message: 'A review must have a description!' })
  description: string;
  @IsNotEmpty({ message: 'A review must belong to a shop!' })
  shopId: Types.ObjectId;
  @IsNotEmpty({ message: 'A review must belong to a shop!' })
  user: Types.ObjectId;
  @IsNotEmpty({ message: 'A review must have an item!' })
  item: string;
  @IsNotEmpty({ message: 'A review must have a title!' })
  title: string;
}
