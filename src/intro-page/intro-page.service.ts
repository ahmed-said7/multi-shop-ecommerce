import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateIntroPageDto } from './dto/create-intro-page.dto';
import { UpdateIntroPageDto } from './dto/update-intro-page.dto';
import { IntroPage, IntroPageDocument } from './schemas/intro_page_schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';

@Injectable()
export class IntroPageService {
  constructor(
    @InjectModel(IntroPage.name)
    private introPageModel: Model<IntroPageDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
  ) {}
  async create(createIntroPageDto: CreateIntroPageDto, shopId: Types.ObjectId) {
    try {
      const payload = {
        ...createIntroPageDto,
        shopId,
      };
      const introPage = await this.introPageModel.create(payload);
      const shop = await this.shopModel.findById(shopId);
      shop.introPages.push(introPage.id);
      await shop.save();
      return introPage;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(shopId?: Types.ObjectId) {
    try {
      const shop = await this.shopModel.findById(shopId);
      if (!shop) {
        throw new NotFoundException('this shop not found');
      }
      const introPage = await this.introPageModel.find({ shopId });
      return introPage;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async findOne(id: string) {
    try {
      const introPage = await this.introPageModel.findById(id);
      if (!introPage) {
        throw new NotFoundException('this page not found');
      }
      return introPage;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async update(id: string, updateIntroPageDto: UpdateIntroPageDto) {
    try {
      const introPageExist = await this.introPageModel.findById(id);
      if (!introPageExist) {
        throw new NotFoundException('this page not found');
      }
      const introPage = await this.introPageModel.findByIdAndUpdate(
        id,
        updateIntroPageDto,
        { new: true },
      );
      return introPage;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async remove(id: string) {
    try {
      const introPageExist = await this.introPageModel.findById(id);
      if (!introPageExist) {
        throw new NotFoundException('this page not found');
      }
      const introPage = await this.introPageModel.findByIdAndDelete(id);
      const shop = await this.shopModel.findById(introPage.shopId);
      for (let i = 0; i < shop.introPages.length; i++) {
        if (id == shop.introPages[i]) shop.introPages.splice(i, 1);
      }
      await shop.save();
      return 'Intro page has been deleted successfully';
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
