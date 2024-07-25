import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Types } from 'mongoose';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'A review must have a rating!' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
  shopId: string;
  user: string;
  @IsNotEmpty({ message: 'A review must have an item!' })
  @IsMongoId()
  item: string;
  @IsNotEmpty({ message: 'A review must have a title!' })
  @IsString()
  title: string;
};
