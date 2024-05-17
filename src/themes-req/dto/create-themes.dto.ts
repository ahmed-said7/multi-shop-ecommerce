import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ThemeType } from '../schemas/theme.schema';

export class CreateThemeDto {
  @IsEnum(ThemeType)
  @IsNotEmpty()
  title: ThemeType;

  @IsString()
  @IsOptional()
  description?: string;
}
