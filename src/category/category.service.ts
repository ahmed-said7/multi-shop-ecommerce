import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category_schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/user/schemas/user_schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: mongoose.Model<CategoryDocument>,
    @InjectModel(Shop.name) private readonly shopModel: mongoose.Model<ShopDocument>,
    @InjectModel(User.name) private readonly userModel: mongoose.Model<UserDocument>,
    private readonly jwtService: JwtService
  ) { }
  private decodeToken(token: string) {
    return this.jwtService.decode<{ userId: string; username: string }>(token);
  }
  async create(request: any, createCategoryDto: CreateCategoryDto) {
    try {
      const userEmail = this.decodeToken(request.headers.authorization.split(' ')[1]).username
      const user = await this.userModel.findOne({ email: userEmail }).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err);
      })
      if (!user) throw new NotFoundException('There is no user with this id')
      createCategoryDto.shopID = user.shop
      const category = await this.categoryModel.create(createCategoryDto).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err)
      });
      await this.shopModel.findByIdAndUpdate(user.id, { $push: { categories: category.id } }).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err)

      })
      return 'Category created successfully'
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(request: any) {
    try {
      const userEmail = this.decodeToken(request.headers.authorization.split(' ')[1]).username
      const user = await this.userModel.findOne({ email: userEmail }).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err);
      })
      if (!user) throw new NotFoundException('There is no user with this id')
      const categories = await this.categoryModel.find({ shopID: user.shop }).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err)
      })
      return categories;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {  
      const category = await this.categoryModel.findById(id).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err)
      })
      return category
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true }).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err)
      })

      return category
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      await this.categoryModel.findByIdAndDelete(id).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err)
      })
      return "Category has been deleted successfully"
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
