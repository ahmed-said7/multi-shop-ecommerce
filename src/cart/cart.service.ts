import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Cart } from './schemas/cart.schema';
import { CreateCartItemDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  // get user cart
  async getCart(userId: string, shopId: string) {
    try {
      const items = await this.cartModel.find({ userId, shopId });
      if (!items.length) {
        throw new NotFoundException(`Cart not found`);
      }
      return items;
    } catch (error) {
      throw new BadRequestException(`cannot found cart ${error}`);
    }
  }
  // create cart and add or edit item in cart
  async addToCart(userId: string, item: CreateCartItemDto) {
    const cartItem = await this.cartModel.findOne({
      userId,
      size: item.size,
      color: item.color,
      itemId: item.itemId,
      shopId: item.shopId,
    });

    // Update The Exsiting Item if it exisists.
    if (cartItem.id) {
      return await this.cartModel.findByIdAndUpdate(
        cartItem.id,
        {
          $inc: {
            quantity: 1,
          },
        },
        {
          new: true,
        },
      );
    }

    return await new this.cartModel({ ...item, userId, quantity: 1 }).save();
  }

  // remove item from cart
  async removeFromCart(cartItemId: string) {
    const cart = await this.cartModel.findById(cartItemId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return await this.cartModel.findByIdAndDelete(cartItemId);
  }

  // update item quantity in global (not needed at now)
  async updateItemQuantity(itemId: string, quantity: number) {
    const cart = await this.cartModel.findById(itemId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return await this.cartModel.findByIdAndUpdate(
      itemId,
      { quantity },
      { new: true },
    );
  }
}
