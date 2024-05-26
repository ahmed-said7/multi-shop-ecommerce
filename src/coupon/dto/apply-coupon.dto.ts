import { Types } from 'mongoose';

import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsNumber,
  IsString,
} from 'class-validator';

export class applyCoupon {
  @IsString({ message: 'text must be string' })
  text: string;

  @IsString({ message: 'shop id must be string  ' })
  @IsMongoId({ message: 'should be valid id ' })
  shopId: string;
}
