import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ThemeType } from 'src/common/enums';


export class CreateThemeDto {
  @IsNotEmpty()
  @IsEnum(ThemeType)
  title: ThemeType;
  
  @IsOptional()
  @IsString()
  description?: string;
}
