import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;
  @IsNumber()
  price: number;
  @IsNumber()
  amount: number;
  @IsString()
  description: string;
  @IsArray({ message: 'Item categories must be an array' })
  category: string[];
  @IsString()
  brand?: string;
  @IsNumber()
  rating?: number;
  @IsArray({ message: 'Item sizes must be an array' })
  sizes?: string[];
  @IsArray({ message: 'Item images must be an array' })
  images?: string[];
  @IsArray({ message: 'Item colors must be an array' })
  colors?: string[];

  soldTimes?: number;
}
