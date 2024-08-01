import { Model } from 'mongoose';
import {
  BadRequestException,
  Body,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import { IAuthUser } from 'src/common/enums';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Item, ItemDocument } from 'src/item/schemas/item-schema';
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    private i18n: CustomI18nService,
  ) {}

  // get user cart
  async getCart(userId: string, shopId: string) {
    const items = await this.cartModel
      .find({ userId, shopId })
      .populate('itemId', 'name price images');

    if (items.length == 0) {
      throw new BadRequestException(this.i18n.translate('test.cart.notFound'));
    }

    const totalPrice = items.reduce((total, item) => {
      const itemPrice = (item.itemId as any)?.price || 0;
      return total + itemPrice * item.quantity;
    }, 0);

    return { items, totalPrice };
  }
  // create cart and add or edit item in cart
  async addToCart(userId: string, item: AddToCartDto) {
    const itemExists = await this.itemModel.findById(item.itemId);
    if (!itemExists) {
      throw new HttpException(this.i18n.translate('test.items.notFound'), 400);
    }
    item.shopId = itemExists.shopId.toString();
    const cartItem = await this.cartModel.findOne({
      userId,
      color: item.color,
      itemId: item.itemId,
      shopId: item.shopId,
    });

    // Update The Exsiting Item if it exisists.
    if (cartItem) {
      await this.cartModel.findByIdAndUpdate(cartItem._id, {
        $inc: {
          quantity: item.quantity || 1,
        },
      });
    } else {
      await this.cartModel.create({ ...item, userId });
    }
    return this.getCart(userId, item.shopId);
  }

  // remove item from cart
  async removeFromCart(cartItemId: string, user: IAuthUser) {
    const cart = await this.cartModel.findOneAndDelete({
      _id: cartItemId,
      userId: user._id,
    });
    if (!cart) {
      throw new NotFoundException(this.i18n.translate('test.cart.notFound'));
    }
    return this.getCart(cart.userId.toString(), cart.shopId.toString());
  }

  // update item quantity in global (not needed at now)
  async updateItemQuantity(itemId: string, quantity: number, user: IAuthUser) {
    const cart = await this.cartModel.findOneAndUpdate(
      { _id: itemId, userId: user._id },
      { quantity },
    );
    if (!cart) {
      throw new NotFoundException(this.i18n.translate('test.cart.notFound'));
    }
    return this.getCart(cart.userId.toString(), cart.shopId.toString());
  }
}
