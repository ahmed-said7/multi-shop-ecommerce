import mongoose from 'mongoose';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './schemas/user_schema';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Shop.name)
    private readonly shopModel: mongoose.Model<ShopDocument>,
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<UserDocument>,
  ) {}

  async trackShop(userId: string, shopId: string) {
    const shop = await this.shopModel.findById(shopId);

    if (!shop) {
      throw new NotFoundException(`Shop with ID ${shopId} is not found`);
    }

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

    return { shop: updatedShop };
  }
}
