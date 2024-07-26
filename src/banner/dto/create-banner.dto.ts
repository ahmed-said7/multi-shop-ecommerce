import { IsNotEmpty, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateBannerDto {

  // @IsNotEmpty({ message : i18nValidationMessage("validation.banner.title.isNotEmpty") })
  @IsString({ message : i18nValidationMessage("validation.banner.title.isString") })
  title: string;

  // @IsNotEmpty({ message : i18nValidationMessage("validation.banner.subTitle.isNotEmpty") })
  @IsString({ message : i18nValidationMessage("validation.banner.subTitle.isString") })
  subTitle: string;

  // @IsNotEmpty({ message : i18nValidationMessage("validation.banner.titleAndSubTitlePosition.isNotEmpty") })
  @IsString({ message : i18nValidationMessage("validation.banner.titleAndSubTitlePosition.isString") })
  titleAndSubTitlePosition: string;

  // @IsNotEmpty({ message : i18nValidationMessage("validation.banner.titleAndSubTitleColor.isNotEmpty") })
  @IsString({ message : i18nValidationMessage("validation.banner.titleAndSubTitleColor.isString") })
  titleAndSubTitleColor: string;

  // @IsNotEmpty({ message : i18nValidationMessage("validation.banner.buttonText.isNotEmpty") })
  @IsString({ message : i18nValidationMessage("validation.banner.buttonText.isString") })
  buttonText: string;

  // @IsNotEmpty({ message : i18nValidationMessage("validation.banner.buttonLink.isNotEmpty") })
  @IsString({ message : i18nValidationMessage("validation.banner.buttonLink.isString") })
  buttonLink: string;

  // @IsNotEmpty({ message : i18nValidationMessage("validation.banner.buttonColor.isNotEmpty") })
  @IsString({ message : i18nValidationMessage("validation.banner.buttonColor.isString") })
  buttonColor: string;

  // @IsNotEmpty({ message : i18nValidationMessage("validation.banner.buttonTextColor.isNotEmpty") })
  @IsString({ message : i18nValidationMessage("validation.banner.buttonTextColor.isString") })
  buttonTextColor: string;

  // @IsNotEmpty({ message : i18nValidationMessage("validation.banner.buttonPosition.isNotEmpty") })
  @IsString({ message : i18nValidationMessage("validation.banner.buttonPosition.isString") })
  buttonPosition: string;

  // @IsNotEmpty({ message : i18nValidationMessage("validation.banner.image.isNotEmpty") })
  @IsString({ message : i18nValidationMessage("validation.banner.image.isString") })
  image: string;
}
