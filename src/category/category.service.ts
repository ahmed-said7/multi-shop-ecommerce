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
import { QueryCategoryDto } from './dto/query-category.dto';
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: mongoose.Model<CategoryDocument>,
    @InjectModel(Shop.name)
    private readonly shopModel: mongoose.Model<ShopDocument>,
    private apiService:ApiService<CategoryDocument,QueryCategoryDto>,
    private i18n:CustomI18nService
  ) {};

  async create(shopId: string, body: CreateCategoryDto) {
    const category = await this.categoryModel.create({
      ... body , shopId
    });

    await this.shopModel.findByIdAndUpdate(
      category.shopId,
      {
        $addToSet: { categories: category._id },
      }
    );

    return {category};
  }

  async findAll(query:QueryCategoryDto) {
    // const filter={ shopId : new Types.ObjectId(shopId) };
    const {query:result,paginationObj}=await this.apiService
      .getAllDocs(this.categoryModel.find(),query,[]);
    const categories=await result;
    if( categories.length == 0  ){
      throw new HttpException(this.i18n.translate("test.category.notFound"),400);
    };
    return { categories , pagination:paginationObj };
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findOne({ _id: id });

    if (!category) {
      throw new NotFoundException(this.i18n.translate("test.category.notFound"));
    };

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
      throw new NotFoundException(this.i18n.translate("test.category.notFound"));
    }

    return {category};
  }

  async remove(id: string, shopId: string) {
    const category = await this.categoryModel.findOneAndDelete({
      _id: id,
      shopId
    });

    if (!category) {
      throw new NotFoundException(this.i18n.translate("test.category.notFound"));
    };

    await this.shopModel.findByIdAndUpdate(
      shopId,
      {
        $pull: { categories: id },
      }
    );

    return {category};

  };
}
