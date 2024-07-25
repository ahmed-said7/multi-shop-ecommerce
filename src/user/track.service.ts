import mongoose from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Shop, ShopDocument } from '../shop/schemas/shop_schema';
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Shop.name)
    private readonly shopModel: mongoose.Model<ShopDocument>,
    private i18n:CustomI18nService
  ) {}

  async trackShop(userId: string, shopId: string) {
    const shop = await this.shopModel.findById(shopId);

    if (!shop) {
      throw new NotFoundException(this.i18n.translate("test.shop.notFound"));
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
