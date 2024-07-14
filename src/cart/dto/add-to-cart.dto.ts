import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddToCartDto {
  @IsNotEmpty()
  @IsMongoId()
  shopId: string;
  @IsNotEmpty()
  @IsMongoId()
  itemId: string;
  @IsOptional()
  @IsNumber()
  quantity: number;
  @IsOptional()
  @IsString()
  size?: string;
  @IsNotEmpty()
  @IsString()
  color?: string;
}
