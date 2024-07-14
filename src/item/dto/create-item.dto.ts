import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsNotEmpty()
  @IsNumber()
  amount: number;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsMongoId()
  category: string;
  @IsOptional()
  @IsArray()
  @IsString({ each:true })
  sizes?: string[];
  @IsOptional()
  @IsArray()
  @IsString({ each:true })
  images?: string[];
  @IsOptional()
  @IsArray()
  @IsString({ each:true })
  colors?: string[];
  @IsOptional()
  @IsNumber()
  soldTimes?: number;
}
