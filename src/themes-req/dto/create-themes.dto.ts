import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ThemeType } from '../schemas/theme.schema';

export class CreateThemeDto {
  @IsNotEmpty()
  @IsEnum(ThemeType)
  title: ThemeType;
  
  @IsOptional()
  @IsString()
  description?: string;
}
