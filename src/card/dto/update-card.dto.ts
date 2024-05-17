import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
} from 'class-validator';
export class UpdateCardDto extends PartialType(CreateCardDto) {
  @IsNotEmpty({ message: 'A shop must have at least one category' })
  @IsArray({ message: 'A shop must have a string array category' })
  photo: string;

  @IsNotEmpty({ message: 'A shop must have at least one category' })
  @IsArray({ message: 'A shop must have a string array category' })
  buttonsLink: string;

  @IsNotEmpty({ message: 'A shop must have at least one category' })
  @IsArray({ message: 'A shop must have a string array category' })
  buttonsTitle: string;

  @IsNotEmpty({ message: 'A shop must have at least one category' })
  @IsArray({ message: 'A shop must have a string array category' })
  link: string;

  @IsNotEmpty({ message: 'A shop must have at least one category' })
  @IsArray({ message: 'A shop must have a string array category' })
  title: string;
}
