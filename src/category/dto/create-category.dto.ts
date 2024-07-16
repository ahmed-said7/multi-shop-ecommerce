import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength
} from 'class-validator';

export class CreateCategoryDto {
  // Category title, must not be empty, and should be a string
  @IsNotEmpty({ message: 'A Category must have a title' })
  @IsString({ message: 'A Category must have a string title' })
  @MinLength(3, {
    message: 'A Category title must be at least 3 characters long',
  })
  @MaxLength(20, {
    message: 'A Category title must be at most 20 characters long',
  })
  title: string;
  
  @IsNotEmpty()
  @IsString()
  image: string;
}
