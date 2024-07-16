import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, Injectable } from '@nestjs/common';
import { Theme, ThemeDocument } from './schemas/theme.schema';
import { User, UserDocument } from 'src/user/schemas/user_schema';
import { ApiService } from 'src/common/filter/api.service';
import { QueryThemeDto } from './dto/query-themes.dto';

@Injectable()
export class ThemesService {
  constructor(
    private apiService:ApiService<ThemeDocument,QueryThemeDto>,
    @InjectModel(Theme.name)
    private readonly themeModel: mongoose.Model<ThemeDocument>
  ) {}

  async createTheme(
    title: string,
    description: string,
    userId: string,
  ) {

    const createdTheme = await this.themeModel.create({
      title,
      description,
      createdBy: userId,
    });

    return { createdTheme };
  }

  async getThemes(
    query:QueryThemeDto
  ) {
    const {query:result,paginationObj}=await this.apiService
      .getAllDocs(this.themeModel.find(),query);
    const themes=await result;
    if( themes.length == 0  ){
      throw new HttpException("themes not found",400);
    };
    return { themes , pagination : paginationObj };
  }
}
