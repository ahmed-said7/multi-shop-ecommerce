import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @IsString({ message: 'A Category must have a string title' })
  @MinLength(3, {
    message: 'A Category title must be at least 3 characters long',
  })
  @MaxLength(20, {
    message: 'A Category title must be at most 20 characters long',
  })
  title: string;

//   @IsOptional()
//   @IsArray({ message: 'A Category must have a string array subCategory' })
//   @IsString({each: true})
//   subCategory: string[];
}
