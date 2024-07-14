import { IsNotEmpty, IsBoolean, IsEnum, IsMongoId, IsOptional, IsString, ValidateNested, IsMobilePhone, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class ValidateAddresse {
    @IsNotEmpty()
    @IsString()
    city?: string;
    @IsNotEmpty()
    @IsString()
    @IsMobilePhone()
    mobile?: string;
    @IsNotEmpty()
    @IsString()
    streetName?: string;
    @IsOptional()
    @IsNumber()
    zipCode?: number;
    @IsNotEmpty()
    @IsString()
    country?: number;
};


export class CreateOrderDto {
  @IsNotEmpty({ message: 'An order must have a shop' })
  @IsMongoId()
  shopId: string;

  @IsNotEmpty({message:"field should be object"})
  @ValidateNested()
  @Type( ( ) => ValidateAddresse )
  userAddress?: {
    city?: string;
    country?: string;
    streetName?: string;
    zipCode?: number;
    mobile: string
  };

  @IsOptional()
  @IsString()
  couponName: string;
  
  carItems: 
    {
      product: Types.ObjectId;
      quantity: number;
      size: string;
      color: string;
    }[];
  priceTotal: number;
};
