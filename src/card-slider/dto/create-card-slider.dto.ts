import { IsNotEmpty, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCardSliderDto {
  @IsArray({ message: 'A CardSlider must have an array of card IDs' })
  cards: Types.ObjectId[];

  @IsNotEmpty({ message: 'A CardSlider must have a shop ID' })
  shop: Types.ObjectId;
}
