import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item, ItemDocument } from './schemas/item-schema';
import mongoose, { Model, MongooseError, Types } from 'mongoose';
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
  async create(createItemDto: CreateItemDto, shopId: string) {
    try {
      const payload = {
        ...createItemDto,
        shopId,
      };

      console.log(payload);

      const item = await new this.itemModel(payload).save();

      const shop = await this.shopModel.findById(item.shopId);

      shop?.itemsIDs?.push(item.id);

      await shop?.save();
      return item;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  async findAll(
    page?: number,
    shopId?: Types.ObjectId,
    category?: string,
    subCategory?: string,
    sortOrder?: string,
    minPrice?: number,
    maxPrice?: number,
    keyword?: string,

    limitParam?: number,
  ) {
    try {
      const query: any = { shopId, category, subCategories: subCategory };

      // Remove undefined or null values from the query object
      Object.keys(query).forEach(
        (key) => query[key] == null && delete query[key],
      );

      // Add minimum and maximum price filters to the query
      if (minPrice !== undefined && maxPrice !== undefined) {
        query.price = { $gte: minPrice, $lte: maxPrice }; // Minimum and maximum price filter
      } else if (minPrice !== undefined) {
        query.price = { $gte: minPrice }; // Minimum price filter
      } else if (maxPrice !== undefined) {
        query.price = { $lte: maxPrice }; // Maximum price filter
      }

      if (keyword) {
        query.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ];
      }

      const count = await this.itemModel.countDocuments(query);

      const pageValue = +page || 1;
      const limit = +limitParam || 10;

      // Construct sort criteria based on sortOrder

      const skip = (pageValue - 1) * limit;
      const endIndex = pageValue * limit;

      const pagination: {
        currentPage: number;
        numberOfPages: number;
        limit: number;
        nextPage: number;
        prevPage: number;
      } = {
        currentPage: 0,
        numberOfPages: 0,
        limit: 0,
        nextPage: 0,
        prevPage: 0,
      };
      pagination.currentPage = pageValue;
      pagination.numberOfPages = Math.ceil(count / limit); // 90 / 20 = 4.3  => 5
      pagination.limit = limit;

      if (endIndex < count) {
        pagination.nextPage = pageValue + 1;
      }
      if (skip > 0) {
        pagination.prevPage = pageValue - 1;
      }

      const sortCriteria: any = {};
      if (sortOrder === 'asc') {
        sortCriteria['price'] = 1;
      } else if (sortOrder === 'desc') {
        sortCriteria['price'] = -1;
      }

      // Find items based on the constructed query and sort criteria
      const items = await this.itemModel
        .find(query)
        .sort(sortCriteria)
        .limit(limit)
        .skip(skip)
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });

      // Count the total number of matching items

      return { count, pagination, items };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const item = await this.itemModel.findById(id);
      if (!item) throw new NotFoundException('Item not found!');
      return item;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    try {
      let item = await this.itemModel.findById(id);
      if (!item) throw new NotFoundException('Item not found!');
      updateItemDto.images = item.images.concat(updateItemDto.images);
      item = await this.itemModel.findByIdAndUpdate(id, updateItemDto, {
        new: true,
      });

      return item;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // remove image from item.images
  async removeImage(id: string, image: string) {
    try {
      const item = await this.itemModel.findById(id);
      if (!item) throw new NotFoundException('Item not found!');
      const index = item.images.indexOf(image);
      if (index > -1) {
        item.images.splice(index, 1);
      }
      await item.save();
      return item;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      await this.itemModel.findByIdAndDelete(id);

      return 'deleted item successfully';
    } catch (error: any) {
      // 500.
      throw new InternalServerErrorException(error?.message);
    }
  }
}
