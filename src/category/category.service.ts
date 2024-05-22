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
    updateCategoryDto: UpdateCategoryDto,
    shopId: string,
    userRole: string,
  ) {
    const categoryShop = (await this.categoryModel.findById(id)).shopId;

    try {
      const category = await this.categoryModel
        .findByIdAndUpdate(id, updateCategoryDto, { new: true })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });

      return category;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      await this.categoryModel.findByIdAndDelete(id).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      return 'Category has been deleted successfully';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
