import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePhotoSliderDto {
  @IsString({ message: 'must be a string' })
  title: string;
  @IsString({ message: 'must be a string' })
  subTitle: string;
  @IsNumber()
  titleAndSubTitlePostion: number;
  @IsString({ message: 'must be a string' })
  titleAndSubTitleColor: string;
  @IsString({ message: 'must be a string' })
  buttonText: string;
  @IsString({ message: 'must be a string' })
  buttonLink: string;
  @IsString({ message: 'must be a string' })
  buttonColor: string;
  @IsString({ message: 'must be a string' })
  buttonTextColor: string;
  @IsNumber()
  buttonPosition: number;
  @IsString({ message: 'must be a string' })
  photo: string;

  @IsString({ message: 'must be a string' })
  containerName: string;
  @IsBoolean({ message: 'must be a bool' })
  isContainer: boolean = false;
  @IsBoolean({ message: 'must be a bool' })
  isSlider: boolean = false;

  @IsNotEmpty({ message: 'A PhotoSlider must have a shop ID' })
  shop: Types.ObjectId;
}
