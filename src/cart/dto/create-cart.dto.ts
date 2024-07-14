import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCartDto {
  itemId: string;
  shopId: string;
  /**The User who add the item to his cart */
  userId: string;
}

export class CreateCartItemDto extends CreateCartDto {
  /**The Item Quantity */
  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsMongoId()
  shopId: string;

  @IsNotEmpty()
  @IsMongoId()
  itemId: string;
  
  @IsOptional()
  @IsString()
  sizes: string;
  
  @IsNotEmpty()
  @IsString()
  colors: string;
}
