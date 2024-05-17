import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Theme, ThemeDocument } from './schemas/theme.schema';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/user/schemas/user_schema';

@Injectable()
export class ThemesService {
  constructor(
    @InjectModel(Theme.name)
    private readonly themeModel: mongoose.Model<ThemeDocument>,
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}
  private decodeToken(token: string) {
    return this.jwtService.decode<{ sub: string; email: string }>(token);
  }
  async createTheme(
    title: string,
    description: string,
    request: any,
  ): Promise<ThemeDocument> {
    const userId = this.decodeToken(
      request.headers.authorization.split(' ')[1],
    ).sub;
    const user = await this.userModel.findOne({ _id: userId }).catch((err) => {
      console.log(err);
      throw new InternalServerErrorException(err);
    });
    if (!user) throw new NotFoundException('There is no user with this id');
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
