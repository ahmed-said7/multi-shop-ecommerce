import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVideoContainerDto {
  @IsNotEmpty()
  @IsString({ message: 'link must be a string' })
  link: string;
}
