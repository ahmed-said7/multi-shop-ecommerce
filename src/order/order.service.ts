import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';

import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument, OrderStatusTypes } from './schemas/order_schema';

import { User, UserDocument } from 'src/user/schemas/user_schema';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { Cart } from 'src/cart/schemas/cart.schema';
import { Coupon } from 'src/coupon/schemas/coupon.schema';
import { CouponService } from 'src/coupon/coupon.service';
import { applyCoupon } from 'src/coupon/dto/apply-coupon.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<UserDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: mongoose.Model<OrderDocument>,
    @InjectModel(Shop.name)
    private readonly shopModel: mongoose.Model<ShopDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: mongoose.Model<Cart>,
    @InjectModel(Coupon.name)
    private readonly couponModel: mongoose.Model<Coupon>,
    private readonly couponService: CouponService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    try {
      const { shopId, couponName } = createOrderDto;

      // Validate user cart and get items and total price
      const cart = await this.couponService.calculateTotalPrice(userId, shopId);
      const { items, totalPrice: originalTotalPrice } = cart;

      if (!items.length) {
        throw new BadRequestException('Your cart is empty');
      }

      // Validate shop existence
      const shop = await this.shopModel.findById(shopId);
      if (!shop) {
        throw new NotFoundException("This shop doesn't exist");
      }

      // Prevent users from ordering from their own shop
      if (userId === shop.userID.toString()) {
        throw new UnauthorizedException(
          "You can't make an order from your own shop",
        );
      }

      // Apply coupon if provided
      let finalTotalPrice = originalTotalPrice;
      const applyCoupon: applyCoupon = {
        shopId,
        text: couponName,
      };
      if (couponName) {
        const { finalPrice } = await this.couponService.applyCoupon(
          userId,
          applyCoupon,
        );
        finalTotalPrice = finalPrice;

        // Decrement the coupon usage count
        await this.couponModel.findOneAndUpdate(
          { text: couponName },
          {
            $inc: { usageLimit: -1 },
          },
          { new: true },
        );
      }

      // Create and save the order
      const order = await new this.orderModel({
        ...createOrderDto,
        userId,
        items: items.map(
          (item) => new mongoose.Types.ObjectId(item._id as string),
        ),
        priceTotal: finalTotalPrice,
        status: OrderStatusTypes.INPROGRESS,
      }).save();

      await this.cartModel.deleteMany({ userId, shopId });

      // Clear the user'suserId: string, shopId: string, couponName: string, applyCoupon: applyCouponme: string, applyCoupon: applyCouponMany({ userId, shopId });

      return order;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAllShopOrder(shopId: string, userRole: string) {
    if (userRole !== 'shop_owner') {
      throw new ForbiddenException("you don't have permission ");
    }

    const orders = await this.orderModel
      .find({ shopId: shopId.toString() })
      .populate('items')
      .exec();

    console.log({ orders });

    return orders;
  }

  async findAllUserOrder(userId: string, shopId: string) {
    return await this.orderModel
      .find({
        shopId: shopId.toString(),
        userId,
      })
      .populate('items');
  }

  async findOne(id: string) {
    return await this.orderModel.findById(id).populate('items', 'userIdId');
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    return await this.orderModel.findByIdAndUpdate(id, updateOrderDto, {
      new: true,
    });
  }

  async remove(id: string, userId: string) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException("This user doesn't exist");
      }

      if (user.role != 'admin') {
        throw new UnauthorizedException("You can't delete this order");
      }

      const order = await this.orderModel.findByIdAndDelete(id);

      return order;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async confimeDelivery(id: string) {
    const order = await this.orderModel.findById(id);

    if (!order._id) {
      throw new NotFoundException('No order with such a string');
    }

    await this.cartModel.deleteMany({
      _id: { $in: order.items },
    });

    return await this.orderModel.findByIdAndUpdate(order._id, {
      status: OrderStatusTypes.DELIVERED,
    });
  }
}
