import {
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class applyCoupon {
  @IsNotEmpty()
  @IsString({ message: 'text must be string' })
  text: string;
  
  @IsNotEmpty()
  @IsMongoId({ message: 'should be valid id ' })
  shopId: string;
}
