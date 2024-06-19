import { IsNotEmpty, IsArray } from 'class-validator';

export class CreatePhotoSliderDto {
  @IsArray()
  @IsNotEmpty()
  photoSlides: {
    title: string;
    subTitle: string;
    titleAndSubTitlePostion: string;
    titleAndSubTitleColor: string;
    buttonText: string;
    buttonLink: string;
    buttonColor: string;
    buttonTextColor: string;
    buttonPosition: string;
    photo: string;
  }[];
  isContainer: boolean;
  isRounded: boolean;
  shopId: string;
}
