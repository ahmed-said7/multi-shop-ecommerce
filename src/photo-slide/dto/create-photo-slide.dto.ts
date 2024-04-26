import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import mongoose, { Types } from 'mongoose';

export class CreatePhotoSlideDto {
  @IsString({ message: 'must be a string' })
  title: string;
  @IsString({ message: 'must be a string' })
  subTitle: string;
  @IsString()
  titleAndSubTitlePostion: string;
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
  @IsString()
  buttonPosition: string;
  @IsString({ message: 'must be a string' })
  photo: string;
  @IsNotEmpty({ message: 'A photoSlide must belong a photoSlider' })
  photoSlider: mongoose.Types.ObjectId;
}
