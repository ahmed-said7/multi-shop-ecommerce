import { PartialType } from '@nestjs/mapped-types';
import { CreateIntroPageDto } from './create-intro-page.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateIntroPageDto extends PartialType(CreateIntroPageDto) {
  @IsNotEmpty({ message: 'Intro page must have a title' })
  @IsString({ message: 'title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Intro page must have a paragraph' })
  @IsString({ message: 'title must be a string' })
  paragraph: string;
}
