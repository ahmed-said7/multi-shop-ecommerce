import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1)
  rating: number;
  @IsOptional()
  @IsString()
  title: string;
};

