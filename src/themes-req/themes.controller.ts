import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { ThemeDocument } from './schemas/theme.schema';
import { CreateThemeDto } from './dto/create-themes.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { MerchantGuard } from 'src/auth/guards/merchant.guard';

@Controller('themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}
  @UseGuards(JwtGuard, MerchantGuard)
  @Post()
  async createTheme(
    @Body('userId') userId: string,
    @Body() themeData: CreateThemeDto,
  ): Promise<ThemeDocument> {
    return await this.themesService.createTheme(
      themeData.title,
      themeData.description,
      userId,
    );
  }

  @Get()
  async getThemes(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ThemeDocument[]> {
    return await this.themesService.getThemes(page, limit);
  }
}
