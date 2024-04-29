import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import mongoose, { Types } from 'mongoose';

export class CreatePhotoSlideDto {
  @IsString({ message: 'must be a string title' })
  title: string;
  @IsString({ message: 'must be a string subtitle' })
  subTitle: string;
  @IsString()
  titleAndSubTitlePostion: string;
  @IsString({ message: 'must be a string t&s color' })
  titleAndSubTitleColor: string;
  @IsString({ message: 'must be a string button text' })
  buttonText: string;
  @IsString({ message: 'must be a string button link' })
  buttonLink: string;
  @IsString({ message: 'must be a string button color' })
  buttonColor: string;
  @IsString({ message: 'must be a string button text color' })
  buttonTextColor: string;
  @IsString()
  buttonPosition: string;
  @IsString({ message: 'must be a string photo' })
  photo: string;

  photoSlider?: mongoose.Types.ObjectId;
  shop?: string;
}
