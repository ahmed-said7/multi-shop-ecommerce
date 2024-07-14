import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category_schema';
import mongoose, { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { ApiService } from 'src/common/filter/api.service';
import { UserDocument } from 'src/user/schemas/user_schema';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: mongoose.Model<CategoryDocument>,
    @InjectModel(Shop.name)
    private readonly shopModel: mongoose.Model<ShopDocument>,
    private apiService:ApiService<UserDocument,QueryCategoryDto>
  ) {};

  async create(shopId: string, createCategoryDto: CreateCategoryDto) {
    const payload = {
      ...createCategoryDto,
      shopId
    };

    const category = await this.categoryModel.create(payload);

    await this.shopModel.findByIdAndUpdate(
      payload.shopId,
      {
        $addToSet: { categories: category._id },
      }
    );

    return {category};
  }

  async findAll(query:QueryCategoryDto) {
    const {query:result,paginationObj}=await this.apiService.getAllDocs(this.categoryModel.find(),query);
    const categories=await result;
    if( categories.length == 0  ){
      throw new HttpException("category not found",400);
    };
    return { categories , pagination : paginationObj };
  }

  async findOne(id: string, shopId: string) {
    const category = await this.categoryModel.findOne({ _id: id, shopId });

    if (!category) {
      throw new NotFoundException('No Category is Found');
    }

    return {category};
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

    return {category};
  }

  async remove(id: string, shopId: string) {
    const category = await this.categoryModel.findOneAndDelete({
      _id: id,
      shopId,
    });

    if (!category) {
      throw new NotFoundException('No Category is Found');
    }
    await this.shopModel.findByIdAndUpdate(
      shopId,
      {
        $addToSet: { categories: id },
      }
    );
    return {category};
  }
}
