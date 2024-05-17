import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateCartItemDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';

import { CartItem } from './schemas/cart-item.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartItem.name) private readonly cartItemModel: Model<CartItem>,
  ) {}

  async create(createCartItemDto: CreateCartItemDto) {
    return await new this.cartItemModel(createCartItemDto).save();
  }

  async findAll(userId: string, shopId: string) {
    return await this.cartItemModel.find({
      userId,
      shopId,
    });
  }

  async findOne(id: string) {
    return await this.cartItemModel.findById(id);
  }

  async update(id: string, updateCartDto: UpdateCartItemDto) {
    return await this.cartItemModel.findByIdAndUpdate(id, updateCartDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.cartItemModel.findByIdAndDelete(id);
  }
}
