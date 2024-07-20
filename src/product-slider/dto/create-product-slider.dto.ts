import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductSliderDto {
  @IsOptional()
  @IsArray()
  @IsMongoId({each:true})
  products: string[];
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsOptional()
  @IsBoolean()
  isSlider: boolean;
}
