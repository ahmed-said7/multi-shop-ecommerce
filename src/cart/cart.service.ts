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
      const items = await this.cartModel
        .find({ userId, shopId })
        .populate('itemId', 'name price images');

      if (items.length < 1) {
        return `no item in cart`;
      }

      const totalPrice = items.reduce((total, item) => {
        const itemPrice = (item.itemId as any).price;
        return total + itemPrice * item.quantity;
      }, 0);

      return { items, totalPrice };
    } catch (error) {
      throw new BadRequestException(`cannot found cart ${error}`);
    }
  }
  // create cart and add or edit item in cart
  async addToCart(userId: string, item: CreateCartItemDto) {
    const cartItem = await this.cartModel.findOne({
      userId,
      sizes: item.sizes,
      colors: item.colors,
      itemId: item.itemId,
      shopId: item.shopId,
    });

    // Update The Exsiting Item if it exisists.
    if (cartItem?.id) {
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
    const cart = await this.cartModel.findByIdAndDelete(cartItemId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return 'item deleted successfully';
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
