import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import * as mongoose from 'mongoose';

import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateShopDto } from 'src/shop/dto/update-shop.dto';
import { CreateShopDto } from 'src/shop/dto/create-shop.dto';
import { Review, ReviewDocument } from 'src/review/schemas/review_schema';
import {
  ProductSlider,
  ProductSliderDocument,
} from 'src/product-slider/schemas/productSlider_schema';
import {
  PhotoSlider,
  PhotoSliderDocument,
} from 'src/photo-slider/schemas/photo-slider_schema';
import {
  Category,
  CategoryDocument,
} from 'src/category/schemas/category_schema';
import { Item, ItemDocument } from 'src/item/schemas/item-schema';
import { User, UserDocument } from 'src/user/schemas/user_schema';
import { Banner, BannerDocument } from 'src/banner/schemas/banner_schema';
import {
  VideoContainer,
  VideoContainerDocument,
} from 'src/video-container/schemas/videoContainer-schema';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(Shop.name)
    private readonly shopModel: mongoose.Model<ShopDocument>,
    @InjectModel(Item.name)
    private readonly itemModel: mongoose.Model<ItemDocument>,
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<UserDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: mongoose.Model<CategoryDocument>,
    @InjectModel(ProductSlider.name)
    private readonly productSliderModel: mongoose.Model<ProductSliderDocument>,
    @InjectModel(PhotoSlider.name)
    private readonly photoSliderModel: mongoose.Model<PhotoSliderDocument>,
    @InjectModel(Review.name)
    private readonly reviewModel: mongoose.Model<ReviewDocument>,
    @InjectModel(Banner.name)
    private readonly bannerModel: mongoose.Model<BannerDocument>,
    @InjectModel(VideoContainer.name)
    private readonly videoContainerModel: mongoose.Model<VideoContainerDocument>,
  ) {}

  async create(createShopDto: CreateShopDto) {
    try {
      const shop = await new this.shopModel(createShopDto)
        .save()
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });

      return shop;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(page: number = 0) {
    try {
      const shops = await this.shopModel
        .find()
        .limit(10)
        .skip(page * 10);

      const count = await this.shopModel.find().countDocuments();

      return { count, shops };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<Shop> {
    try {
      const idValid = mongoose.isValidObjectId(id);
      if (!idValid) throw new BadRequestException('Please enter correct Id');

      const foundShop = await this.shopModel
        .findById(id)
        .populate('itemsIDs', 'name')
        .populate({
          path: 'customers',
          model: 'User',
          select: 'name email',
        })
        .populate({
          path: 'categories',
          model: 'Category',
          select: 'name subCategory',
        });

      if (!foundShop)
        throw new NotFoundException('There is no shop with this id');

      return foundShop;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(error);
    }
  }

  async findUserShops(userId: string) {
    try {
      const shops = await this.shopModel.find({
        userID: userId,
      });

      return shops;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateShopDto: UpdateShopDto) {
    try {
      const shop = await this.shopModel.findByIdAndUpdate(id, updateShopDto, {
        new: true,
      });

      return shop;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findShopItems(id: string) {
    try {
      const shop = await this.shopModel
        .findById(id)
        .populate('itemsIDs')
        .exec();
      const items = shop.itemsIDs;
      return items;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const shop = await this.shopModel.findById(id);

      if (!shop) {
        throw new NotFoundException('Shop not found');
      }

      await this.itemModel.deleteMany({ _id: { $in: shop.itemsIDs } });

      await this.userModel.deleteMany({ _id: { $in: shop.customers } });

      await this.categoryModel.deleteMany({ _id: { $in: shop.categories } });

      for (const container of shop.containers) {
        switch (container.containerType) {
          case 'ProductSlider':
            await this.productSliderModel.findByIdAndDelete(
              container.containerID,
            );
            break;
          case 'PhotoSlider':
            await this.photoSliderModel.findByIdAndDelete(
              container.containerID,
            );
            break;
          case 'ReviewContainer':
            await this.reviewModel.findByIdAndDelete(container.containerID);
            break;
          case 'Banner':
            await this.bannerModel.findByIdAndDelete(container.containerID);
            break;

          case 'VideoContainer':
            await this.videoContainerModel.findByIdAndDelete(
              container.containerID,
            );
            break;
        }
      }

      const deletedShop = await this.shopModel
        .findByIdAndDelete(id)
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(
            'An unexpected error happened while removing the shop',
          );
        });

      return deletedShop;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findShopContainers(id: string): Promise<any> {
    try {
      const shop = await this.shopModel
        .findById(id)
        .populate('containers.containerID');
      if (!shop) {
        throw new NotFoundException('shop not found');
      }

      return { containers: shop.containers };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
