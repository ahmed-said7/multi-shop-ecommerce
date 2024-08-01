import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { CreateThemeDto } from './dto/create-themes.dto';
import { Roles } from 'src/common/decorator/roles';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { QueryThemeDto } from './dto/query-themes.dto';
import { AllRoles, IAuthUser } from 'src/common/enums';

@Controller('themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.USER, AllRoles.ADMIN)
  async createTheme(
    @AuthUser() user: IAuthUser,
    @Body() themeData: CreateThemeDto,
  ) {
    return this.themesService.createTheme(
      themeData.title,
      themeData.description,
      user._id,
    );
  }

  @Get()
  async getThemes(@Query() query: QueryThemeDto) {
    return this.themesService.getThemes(query);
  }
}
