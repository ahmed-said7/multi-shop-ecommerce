import mongoose, { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { Category, CategoryDocument } from './schemas/category_schema';
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
    try {
      const categories = await this.categoryModel.find({
        shopId,
      });

      return categories;
    } catch (error) {
      console.error('Error finding categories:', error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.categoryModel.findById(id);
      return category;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: string,
    shopId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      const category = await this.categoryModel.updateOne(
        {
          shopId,
          id,
        },
        updateCategoryDto,
        { new: true },
      );

      return category;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string, shopId: string) {
    try {
      await this.categoryModel.deleteOne({
        shopId,
        id,
      });
      return 'Category has been deleted successfully';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
