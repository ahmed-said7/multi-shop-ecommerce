import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateIntroPageDto } from './dto/create-intro-page.dto';
import { UpdateIntroPageDto } from './dto/update-intro-page.dto';
import { IntroPage, IntroPageDocument } from './schemas/intro_page_schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';

@Injectable()
export class IntroPageService {
  constructor(
    @InjectModel(IntroPage.name)
    private introPageModel: Model<IntroPageDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
  ) {}
  async create(createIntroPageDto: CreateIntroPageDto) {
    try {
      const introPage = await this.introPageModel
        .create(createIntroPageDto)
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      const shop = await this.shopModel.findById(createIntroPageDto.shop);
      shop.introPages.push(introPage.id);
      await shop.save();
      return introPage;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(shop?: string) {
    try {
      const introPage = await this.introPageModel
        .find({ shop })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      return introPage;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const introPage = await this.introPageModel.findById(id).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      return introPage;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateIntroPageDto: UpdateIntroPageDto) {
    try {
      const introPage = await this.introPageModel
        .findByIdAndUpdate(id, updateIntroPageDto)
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      return introPage;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const introPage = await this.introPageModel
        .findByIdAndDelete(id)
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      const shop = await this.shopModel.findById(introPage.shopId);
      for (let i = 0; i < shop.introPages.length; i++) {
        if (id == shop.introPages[i]) shop.introPages.splice(i, 1);
      }
      await shop.save();
      return 'Intro page has been deleted successfully';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
