import { Type } from 'class-transformer';
import { IsNotEmpty, IsArray, ArrayMinSize, IsString, ValidateNested } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
export class PhotoSlides  {
  @IsNotEmpty({ message:i18nValidationMessage("validation.photoSlides.title.isNotEmpty") })
  @IsString({ message:i18nValidationMessage("validation.photoSlides.title.isString") })
  title: string;
  @IsNotEmpty({ message:i18nValidationMessage("validation.photoSlides.subTitle.isNotEmpty") })
  @IsString({ message:i18nValidationMessage("validation.photoSlides.subTitle.isString") })
  subTitle: string;
  @IsNotEmpty({ message:i18nValidationMessage("validation.photoSlides.titleAndSubTitlePostion.isNotEmpty") })
  @IsString({ message:i18nValidationMessage("validation.photoSlides.titleAndSubTitlePostion.isString") })
  titleAndSubTitlePostion: string;
  @IsNotEmpty({ message:i18nValidationMessage("validation.photoSlides.titleAndSubTitleColor.isNotEmpty") })
  @IsString({ message:i18nValidationMessage("validation.photoSlides.titleAndSubTitleColor.isString") })
  titleAndSubTitleColor: string;
  @IsNotEmpty({ message:i18nValidationMessage("validation.photoSlides.buttonText.isNotEmpty") })
  @IsString({ message:i18nValidationMessage("validation.photoSlides.buttonText.isString") })
  buttonText: string;
  @IsNotEmpty({ message:i18nValidationMessage("validation.photoSlides.buttonLink.isNotEmpty") })
  @IsString({ message:i18nValidationMessage("validation.photoSlides.buttonLink.isString") })
  buttonLink: string;
  @IsNotEmpty({ message:i18nValidationMessage("validation.photoSlides.buttonColor.isNotEmpty") })
  @IsString({ message:i18nValidationMessage("validation.photoSlides.buttonColor.isString") })
  buttonColor: string;
  @IsNotEmpty({ message:i18nValidationMessage("validation.photoSlides.buttonTextColor.isNotEmpty") })
  @IsString({ message:i18nValidationMessage("validation.photoSlides.buttonTextColor.isString") })
  buttonTextColor: string;
  @IsNotEmpty({ message:i18nValidationMessage("validation.photoSlides.buttonPosition.isNotEmpty") })
  @IsString({ message:i18nValidationMessage("validation.photoSlides.buttonPosition.isString") })
  buttonPosition: string;
  @IsNotEmpty({ message:i18nValidationMessage("validation.photoSlides.photo.isNotEmpty") })
  @IsString({ message:i18nValidationMessage("validation.photoSlides.photo.isString") })
  photo: string;
}

export class CreatePhotoSliderDto {
  @IsArray({ message:i18nValidationMessage("validation.photoSlider.photoSlides.isArray") })
  @ArrayMinSize( 1 , { message:i18nValidationMessage("validation.photoSlider.photoSlides.arrayMinSize") })
  @ValidateNested()
  @Type( () => PhotoSlides )
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
