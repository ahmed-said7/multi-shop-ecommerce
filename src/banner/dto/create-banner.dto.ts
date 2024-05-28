import { IsNotEmpty, IsArray, IsString, IsBoolean } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  title: string;
  @IsString()
  subTitle: string;
  @IsString()
  titleAndSubTitlePostion: string;
  @IsString()
  titleAndSubTitleColor: string;
  @IsString()
  buttonText: string;
  @IsString()
  buttonLink: string;
  @IsString()
  buttonColor: string;
  @IsString()
  buttonTextColor: string;
  @IsString()
  buttonPosition: string;
  @IsString()
  photo: string;
  @IsBoolean()
  isContainer: boolean;
  @IsBoolean()
  isRounded: boolean;
}
