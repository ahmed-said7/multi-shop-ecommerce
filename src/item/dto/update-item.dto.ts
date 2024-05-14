import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';
import { IsString, IsNumber, IsArray, IsEmpty } from 'class-validator';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @IsString()
  @IsEmpty()
  name?: string;
  @IsNumber()
  @IsEmpty()
  price?: number;
  @IsNumber()
  @IsEmpty()
  amount?: number;
  @IsString()
  @IsEmpty()
  shopID?: string;
  @IsString()
  @IsEmpty()
  description?: string;
  @IsArray({ message: 'Item categories must be an array' })
  @IsEmpty()
  category?: string[];
  @IsString()
  @IsEmpty()
  brand?: string;
  @IsNumber()
  @IsEmpty()
  rating?: number;
  @IsArray({ message: 'Item sizes must be an array' })
  @IsEmpty()
  sizes?: string[];
  @IsArray({ message: 'Item images must be an array' })
  @IsEmpty()
  images?: string[];
  @IsArray({ message: 'Item colors must be an array' })
  @IsEmpty()
  colors?: string[];
}
