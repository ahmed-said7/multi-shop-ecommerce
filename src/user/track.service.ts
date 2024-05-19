import mongoose from 'mongoose';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './schemas/user_schema';
import { Item, ItemDocument } from 'src/item/schemas/item-schema';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { Review, ReviewDocument } from 'src/review/schemas/review_schema';
import {
  Category,
  CategoryDocument,
} from 'src/category/schemas/category_schema';
import {
  CardSlider,
  CardSliderDocument,
} from 'src/card-slider/schemas/cardSlider_schema';
import {
  PhotoSlider,
  PhotoSliderDocument,
} from 'src/photo-slider/schemas/photo-slider_schema';
import {
  ProductSlider,
  ProductSliderDocument,
} from 'src/product-slider/schemas/productSlider_schema';

@Injectable()
export class TrackService {
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

  async trackShop(userId: string, shopId: string) {
    const shop = await this.shopModel.findById(shopId);

    if (!shop) {
      throw new NotFoundException(`Shop with ID ${shopId} is not found`);
    }

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          shopsJoined: shopId,
        },
      },
      {
        new: true,
      },
    );

    const updatedShop = await this.shopModel.findByIdAndUpdate(
      shopId,
      {
        $addToSet: {
          customers: userId,
        },
      },
      {
        new: true,
      },
    );

    return { user, shop: updatedShop };
  }
}
