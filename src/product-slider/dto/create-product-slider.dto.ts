import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProductSliderDto {
  products: string[];
  title: string;
  isSlider: boolean = false;
  @IsNotEmpty({ message: 'A PhotoSlider must have a shop ID' })
  shop: Types.ObjectId;
}
