import { IsNotEmpty, IsArray, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateVideoContainerDto {
  @IsString({ message: 'link must be a string' })
  link: string;
}
