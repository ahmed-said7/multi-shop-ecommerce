import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Banner, BannerDocument } from './schemas/banner_schema';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name)
    private readonly bannerModel: Model<BannerDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
  ) {}

  async create(
    shopId: Types.ObjectId,
    createBannerDto: CreateBannerDto,
  ): Promise<Banner> {
    const payload = {
      ...createBannerDto,
      shopId,
    };

    let createdBanner = await new this.bannerModel(payload).save();

    const Shop = await this.shopModel.findById(shopId);

    if (!Shop) {
      throw new NotFoundException("Couldn't find the shop");
    }

    if (Shop?.containers) {
      Shop.containers.push({
        containerID: createdBanner.id,
        containerType: 'Banner',
      });
    } else {
      Shop.$set('containers', [
        {
          containerID: createdBanner.id,
          containerType: 'Banner',
        },
      ]);
    }

    await Shop.save();
    return createdBanner;
  }

  async findAll(): Promise<Banner[]> {
    return this.bannerModel.find().exec();
  }

  async findOne(id: string): Promise<Banner | null> {
    return this.bannerModel.findById(id).exec();
  }

  async update(
    id: string,
    updateBannerDto: UpdateBannerDto,
  ): Promise<Banner | null> {
    return this.bannerModel
      .findByIdAndUpdate(id, updateBannerDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<string> {
    const banner = await this.bannerModel.findById(id);
    if (!banner) throw new NotFoundException("this banner doesn't exist");

    const shop = await this.shopModel.findById(banner.shopId).catch((err) => {
      console.log(err);
      throw new InternalServerErrorException(err);
    });
    for (let i = 0; i < shop.containers.length; i++) {
      if (shop.containers[i].containerID.toString() === id) {
        shop.containers.splice(i, 1);
        break;
      }
    }
    await shop.save();
    await this.bannerModel.findByIdAndDelete(id).catch((err) => {
      console.log(err);
      throw new InternalServerErrorException(err);
    });
    return 'banner has been deleted successfully!';
  }
}
