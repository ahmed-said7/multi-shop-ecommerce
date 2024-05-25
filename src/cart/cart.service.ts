import { Model, Types } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Cart } from './schemas/cart.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  // get user cart
  async getCart(userId: string) {
    try {
      const cart = await this.cartModel.findOne({ userId });
      if (!cart) {
        throw new NotFoundException(`Cart not found`);
      }
      return cart;
    } catch (error) {
      throw new BadRequestException(`cannot found cart ${error}`);
    }
  }
  // create cart and add or edit item in cart
  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const { itemId, quantity, sizes, colors, shopId } = addToCartDto;
    const itemObjectId = new Types.ObjectId(itemId);
    const cart = await this.cartModel.findOne({ userId, shopId });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.item.equals(itemObjectId) &&
          item.sizes === sizes &&
          item.colors === colors,
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ item: itemObjectId, quantity, sizes, colors });
      }
      return cart.save();
    } else {
      const newCart = new this.cartModel({
        userId: new Types.ObjectId(userId),
        shopId,
        items: [{ item: itemObjectId, quantity, sizes, colors }],
      });
      return newCart.save();
    }
  }

  // remove item from cart
  async removeFromCart(userId: string, itemId: string): Promise<Cart> {
    const itemObjectId = new Types.ObjectId(itemId);
    const cart = await this.cartModel.findOne({ userId });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex((item) =>
      item.item.equals(itemObjectId),
    );

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      return cart.save();
    } else {
      throw new NotFoundException('Item not found in cart');
    }
  }

  // update item quantity in global (not needed at now)
  async updateItemQuantity(
    userId: string,
    itemId: string,
    newQuantity: number,
  ): Promise<Cart> {
    const itemObjectId = new Types.ObjectId(itemId);
    const cart = await this.cartModel.findOne({ userId });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex((item) =>
      item.item.equals(itemObjectId),
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = newQuantity;
      return cart.save();
    } else {
      throw new NotFoundException('Item not found in cart');
    }
  }
}
