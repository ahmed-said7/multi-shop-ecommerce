import { PartialType } from '@nestjs/mapped-types';
import { CreateCardSliderDto } from './create-card-slider.dto';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
} from 'class-validator';
import { Types } from 'mongoose';
export class UpdateCardSliderDto extends PartialType(CreateCardSliderDto) {
  @IsArray()
  cards?: Types.ObjectId[];
}
