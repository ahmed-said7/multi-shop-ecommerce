import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { CreateThemeDto } from './dto/create-themes.dto';
import { Roles } from 'src/common/decorator/roles';
import { UserRole } from 'src/user/schemas/user_schema';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { QueryThemeDto } from './dto/query-themes.dto';


@Controller('themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}
  
  @Post()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.USER,UserRole.ADMIN)
  async createTheme(
    @AuthUser('_id') userId: string,
    @Body() themeData: CreateThemeDto,
  ) {
    return this.themesService.createTheme(
      themeData.title,
      themeData.description,
      userId,
    );
  };

  @Get()
  async getThemes(
    @Query() query: QueryThemeDto,
  ) {
    return this.themesService.getThemes(query);
  }
}
