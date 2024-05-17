import { IsNotEmpty, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCardDto {
  @IsNotEmpty({ message: 'A card must have at least one category' })
  photo: string;

  @IsNotEmpty({ message: 'A card must have at least one category' })
  buttonLink: string;

  @IsNotEmpty({ message: 'A card must have at least one category' })
  buttonTitle: string;

  @IsNotEmpty({ message: 'A card must have at least one category' })
  link: string;

  @IsNotEmpty({ message: 'A card must have at least one category' })
  title: string;

  @IsNotEmpty({ message: 'A Card must have a card ID' })
  shop: Types.ObjectId;

  @IsNotEmpty({ message: 'A Card must have a card slider ID' })
  cardSlider: string;
}
