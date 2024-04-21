import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import * as mongoose from 'mongoose';

import { Review, ReviewDocument } from 'src/review/schemas/review_schema';
import {
  ProductSlider,
  ProductSliderDocument,
} from 'src/product-slider/schemas/productSlider_schema';
import {
  PhotoSlider,
  PhotoSliderDocument,
} from 'src/photo-slider/schemas/photoSlider_schema';
import {
  CardSlider,
  CardSliderDocument,
} from 'src/card-slider/schemas/cardSlider_schema';
import {
  Category,
  CategoryDocument,
} from 'src/category/schemas/category_schema';
import { Item, ItemDocument } from 'src/item/schemas/item-schema';
import { User, UserDocument } from 'src/user/schemas/user_schema';
import { CreateShopDto } from 'src/shop/dto/create-shop.dto';
import { UpdateShopDto } from 'src/shop/dto/update-shop.dto';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { InjectModel } from '@nestjs/mongoose';

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
    @InjectModel(CardSlider.name)
    private readonly cardSliderModel: mongoose.Model<CardSliderDocument>,
    @InjectModel(PhotoSlider.name)
    private readonly photoSliderModel: mongoose.Model<PhotoSliderDocument>,
    @InjectModel(Review.name)
    private readonly reviewModel: mongoose.Model<ReviewDocument>,
  ) {}

  async create(createShopDto: CreateShopDto) {
    try {
      const shop = await new this.shopModel(createShopDto).save();

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
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findUserShops(userId: string) {
    try {
      const shops = await this.shopModel
        .find({
          userID: userId,
        })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
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
        .exec()
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(
            'An expected error happened while finding shop items',
          );
        });
      const items = shop.itemsIDs;
      return items;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const shop = await this.shopModel.findById(id).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(
          'An unexpected error happened while finding the shop',
        );
      });

      if (!shop) {
        throw new NotFoundException('Shop not found');
      }

      await this.itemModel.deleteMany({ _id: { $in: shop.itemsIDs } });

      await this.userModel.deleteMany({ _id: { $in: shop.customers } });

      await this.categoryModel.deleteMany({ _id: { $in: shop.categories } });

      for (const container of shop.containers) {
        switch (container.containerType) {
          case 'productslider':
            await this.productSliderModel.findByIdAndDelete(
              container.containerID,
            );
            break;
          case 'cardslider':
            await this.cardSliderModel.findByIdAndDelete(container.containerID);
            break;
          case 'photoslider':
            await this.photoSliderModel.findByIdAndDelete(
              container.containerID,
            );
            break;
          case 'review':
            await this.reviewModel.findByIdAndDelete(container.containerID);
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
      const shop = await this.shopModel.findById(id).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(
          'An expected error happened while finding shop containers',
        );
      });
      const containers = [];
      shop.containers.forEach(async (container) => {
        switch (container.containerType) {
          case 'review':
            const review = await this.reviewModel
              .findById(container.containerID)
              .catch((err) => {
                console.log(err);
                throw new InternalServerErrorException(
                  'An expected error happened while finding shop containers',
                );
              });
            containers.push(review);
          case 'product slider':
            const productSlider = await this.productSliderModel
              .findById(container.containerID)
              .catch((err) => {
                console.log(err);
                throw new InternalServerErrorException(
                  'An expected error happened while finding shop containers',
                );
              });
            containers.push(productSlider);

          case 'photo slider':
            const photoSlider = await this.photoSliderModel
              .findById(container.containerID)
              .catch((err) => {
                console.log(err);
                throw new InternalServerErrorException(
                  'An expected error happened while finding shop containers',
                );
              });
            containers.push(photoSlider);
          case 'card slider':
            const cardSlider = await this.cardSliderModel
              .findById(container.containerID)
              .catch((err) => {
                console.log(err);
                throw new InternalServerErrorException(
                  'An expected error happened while finding shop containers',
                );
              });
            containers.push(cardSlider);
        }
      });
      return containers;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async addUser(
    shopId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
  ) {
    try {
      const shop = await this.shopModel
        .findByIdAndUpdate(shopId, { $push: { customers: userId } })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      if (!shop) throw new NotFoundException('There is no shop with this id');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
