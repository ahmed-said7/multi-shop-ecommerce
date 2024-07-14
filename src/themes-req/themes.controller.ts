import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { ThemeDocument } from './schemas/theme.schema';
import { CreateThemeDto } from './dto/create-themes.dto';
import { Roles } from 'src/common/decorator/roles';
import { UserRole } from 'src/user/schemas/user_schema';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';


@Controller('themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}
  
  @Post()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
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
