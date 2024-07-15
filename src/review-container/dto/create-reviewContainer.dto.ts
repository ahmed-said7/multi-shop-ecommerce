import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateReviewContainerDto {
  @IsNotEmpty({ message: 'review container must have a refrence review' })
  @IsArray()
  @IsMongoId({each:true})
  reviews: string[];
}
