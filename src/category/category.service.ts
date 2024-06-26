import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category_schema';
import mongoose, { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: mongoose.Model<CategoryDocument>,
    @InjectModel(Shop.name)
    private readonly shopModel: mongoose.Model<ShopDocument>,
  ) {}

  async create(shopId: string, createCategoryDto: CreateCategoryDto) {
    const payload = {
      ...createCategoryDto,
      shopId,
    };

    const category = await new this.categoryModel(payload).save();

    await this.shopModel.findByIdAndUpdate(
      payload.shopId,
      {
        $push: { categories: category._id },
      },
      {
        new: true,
      },
    );

    return category;
  }

  async findAll(shopId: Types.ObjectId) {
    const shop = await this.shopModel.findById(shopId);
    if (!shop) {
      throw new NotFoundException('this shop not found');
    }
    const categories = await this.categoryModel.find({
      shopId,
    });

    return categories;
  }

  async findOne(id: string, shopId: string) {
    const category = await this.categoryModel.findOne({ _id: id, shopId });

    if (!category) {
      throw new NotFoundException('No Category is Found');
    }

    return category;
  }

  async update(
    id: string,
    shopId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryModel.findOneAndUpdate(
      { _id: id, shopId },
      updateCategoryDto,
      { new: true },
    );

    if (!category) {
      throw new NotFoundException('No Category is Found');
    }

    return category;
  }

  async remove(id: string, shopId: string) {
    const category = await this.categoryModel.findOneAndDelete({
      _id: id,
      shopId,
    });

    if (!category) {
      throw new NotFoundException('No Category is Found');
    }

    return category;
  }
}
