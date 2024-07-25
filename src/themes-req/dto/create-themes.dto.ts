import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ThemeType } from 'src/common/enums';


export class CreateThemeDto {
  @IsNotEmpty({ message:i18nValidationMessage("theme.title.isNotEmpty") })
  @IsEnum(ThemeType,{ message:i18nValidationMessage("theme.title.isEnum") })
  title: ThemeType;
  
  @IsOptional()
  @IsString({ message:i18nValidationMessage("theme.description.isNotEmpty") })
  description?: string;
}
