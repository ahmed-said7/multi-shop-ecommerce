import { Type } from 'class-transformer';
import { IsNotEmpty, IsArray, ArrayMinSize, IsString, ValidateNested } from 'class-validator';
export class PhotoSlides  {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  subTitle: string;
  @IsNotEmpty()
  @IsString()
  titleAndSubTitlePostion: string;
  @IsNotEmpty()
  @IsString()
  titleAndSubTitleColor: string;
  @IsNotEmpty()
  @IsString()
  buttonText: string;
  @IsNotEmpty()
  @IsString()
  buttonLink: string;
  @IsNotEmpty()
  @IsString()
  buttonColor: string;
  @IsNotEmpty()
  @IsString()
  buttonTextColor: string;
  @IsNotEmpty()
  @IsString()
  buttonPosition: string;
  @IsNotEmpty()
  @IsString()
  photo: string;
}

export class CreatePhotoSliderDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(()=>PhotoSlides)
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
  shopId?: string;
}
