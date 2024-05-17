import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Theme, ThemeDocument } from './schemas/theme.schema';

import { User, UserDocument } from 'src/user/schemas/user_schema';

@Injectable()
export class ThemesService {
  constructor(
    @InjectModel(Theme.name)
    private readonly themeModel: mongoose.Model<ThemeDocument>,
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<UserDocument>,
  ) {}

  async createTheme(
    title: string,
    description: string,
    userId: string,
  ): Promise<ThemeDocument> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('There is no user with this id');
    }

    const createdTheme = new this.themeModel({
      title,
      description,
      createdBy: user.email,
    });

    return await createdTheme.save();
  }

  async getThemes(
    page: number = 1,
    limit: number = 10,
  ): Promise<ThemeDocument[]> {
    return await this.themeModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }
}
