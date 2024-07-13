import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBannerDto {

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  subTitle: string;

  @IsNotEmpty()
  @IsString()
  titleAndSubTitlePosition: string;

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

  @IsOptional()
  @IsString()
  image: string;
}
