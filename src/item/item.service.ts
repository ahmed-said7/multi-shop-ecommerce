import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item, ItemDocument } from './schemas/item-schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/user/schemas/user_schema';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  private decodeToken(token: string) {
    return this.jwtService.decode<{ userId: string; username: string }>(token);
  }
  async create(createItemDto: CreateItemDto) {
    try {
      const item = await new this.itemModel(createItemDto).save();

      const shop = await this.shopModel.findById(item.shopID);

      shop.itemsIDs.push(item.id);

      await shop.save();
      return item;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  async findAll(
    page = 0,
    shopID?: string,
    category?: string,
    subCategory?: string,
    sortOrder?: string,
    minPrice?: number,
    maxPrice?: number,
    limitParam: number = 10,
  ) {
    try {
      // Find items based on the constructed query and sort criteria
      const items = await this.itemModel
        .find({
          shopID,
          price: { $gte: minPrice || -1, $lte: maxPrice || Infinity },
          category: category,
          subCategories: { $in: subCategory },
        })
        .sort({
          price: sortOrder === 'asc' ? 1 : -1,
        })
        .skip(page * limitParam)
        .limit(limitParam);

      return { count: items.length, items };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const item = await this.itemModel.findById(id).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      if (!item) throw new InternalServerErrorException('Item not found!');
      return item;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateItemDto: UpdateItemDto, request: any) {
    try {
      const item = await this.itemModel.findByIdAndUpdate(id, updateItemDto, {
        new: true,
      });

      const userEmail = this.decodeToken(
        request.headers.authorization.split(' ')[1],
      ).username;

      const user = await this.userModel.findOne({ email: userEmail });

      if (user.shop != item.shopID) {
        throw new NotFoundException(
          'You are not authorized to perform this action',
        );
      }

      const { images, colors, sizes, category } = updateItemDto;

      if (images && images.length > 0) {
        item.images.push(...images);
      }
      if (colors && colors.length > 0) {
        item.colors.push(...colors);
      }
      if (sizes && sizes.length > 0) {
        item.sizes.push(...sizes);
      }
      if (category) {
        item.category.push(...category);
      }

      await item.save();

      return item;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string, request: any) {
    try {
      const item = await this.itemModel.findById(id).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      const userEmail = this.decodeToken(
        request.headers.authorization.split(' ')[1],
      ).username;
      const user = await this.userModel
        .findOne({ email: userEmail })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      if (!user) throw new NotFoundException('There is no user with this id');
      if (user.shop != item.shopID)
        throw new NotFoundException(
          'You are not authorized to perform this action',
        );
      await this.itemModel.findByIdAndDelete(id).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      return 'The item has been deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
