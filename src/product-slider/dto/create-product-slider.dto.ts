import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProductSliderDto {
  products: string[];
  title: string;
  isSlider: boolean = false;
}
