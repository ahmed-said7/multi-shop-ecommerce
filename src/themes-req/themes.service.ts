import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, Injectable } from '@nestjs/common';
import { Theme, ThemeDocument } from './schemas/theme.schema';
import { User, UserDocument } from 'src/user/schemas/user_schema';
import { ApiService } from 'src/common/filter/api.service';
import { QueryThemeDto } from './dto/query-themes.dto';
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Injectable()
export class ThemesService {
  constructor(
    private apiService: ApiService<ThemeDocument, QueryThemeDto>,
    @InjectModel(Theme.name)
    private readonly themeModel: mongoose.Model<ThemeDocument>,
    private i18n: CustomI18nService,
  ) {}

  async createTheme(title: string, description: string, userId: string) {
    const createdTheme = await this.themeModel.create({
      title,
      description,
      createdBy: userId,
    });

    return { createdTheme };
  }

  async getThemes(query: QueryThemeDto) {
    const { query: result, paginationObj } = await this.apiService.getAllDocs(
      this.themeModel.find(),
      query,
    );
    const themes = await result;
    if (themes.length == 0) {
      throw new HttpException(this.i18n.translate('test.theme.notFound'), 400);
    }
    return { themes, pagination: paginationObj };
  }
}
