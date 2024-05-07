import { Controller, Post, Body, Get, Query, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { Theme, ThemeDocument } from './schemas/theme.schema';
import { CreateThemeDto } from './dto/create-themes.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('themes')
export class ThemesController {
    constructor(private readonly themesService: ThemesService) {}
    @UseGuards(JwtGuard)
    @Post()
    async createTheme(@Req() request: Request,@Body() themeData: CreateThemeDto): Promise<ThemeDocument> {
        return await this.themesService.createTheme(themeData.title, themeData.description, request);
    }

    @Get()
    async getThemes(@Query('page') page: number, @Query('limit') limit: number): Promise<ThemeDocument[]> {
        return await this.themesService.getThemes(page, limit);
    }
}
