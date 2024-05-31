import { PartialType } from '@nestjs/mapped-types';
import { CreateShopDto } from './create-shop.dto';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { Types } from 'mongoose';
export class UpdateShopDto extends PartialType(CreateShopDto) {
  // Shop title, must not be empty, and should be a string
  @IsNotEmpty({ message: 'A shop must have a title' })
  @IsString({ message: 'A shop must have a string title' })
  title: string;

  // Shop description, must not be empty, and should be a string
  @IsNotEmpty({ message: 'A shop must have a description' })
  @IsString({ message: 'A shop must have a string description' })
  @MinLength(10, {
    message: 'A shop description must be 10 chracters minimum',
  })
  @MaxLength(150, {
    message: 'A shop description must be 150 chracters maximum',
  })
  description: string;
  itemsIDs: string[];
  // Shop category, must not be empty and should be an array of strings
  categories: string[];

  containers: Types.ObjectId[];

  customers: Types.ObjectId[];

  twitter?: string;

  facebook?: string;

  instagram?: string;

  whatsapp?: string;

  logo?: string;
}
