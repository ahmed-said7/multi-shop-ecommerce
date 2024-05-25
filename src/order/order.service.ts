import {
  BadRequestException,
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
import { Item, ItemDocument } from 'src/item/schemas/item-schema';
import { Cart } from 'src/cart/schemas/cart.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<UserDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: mongoose.Model<OrderDocument>,
    @InjectModel(Shop.name)
    private readonly shopModel: mongoose.Model<ShopDocument>,
    @InjectModel(Item.name)
    private readonly itemModel: mongoose.Model<ItemDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: mongoose.Model<Cart>,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    try {
      const user = await this.userModel.findById(userId);
      const items = await this.cartModel.find({
        userId,
        shopId: createOrderDto.shopId,
      });

      if (!user) {
        throw new NotFoundException("This user doesn't exist");
      }

      if (!items.length) {
        throw new BadRequestException('You should add items to make order');
      }

      const shop = await this.shopModel.findById(createOrderDto.shopId);

      if (!shop) throw new NotFoundException("This shop doesn't exist");

      const sellerId = shop.userID;

      if (userId === sellerId.toString()) {
        throw new UnauthorizedException(
          'You cant make an order from your own shop',
        );
      }

      createOrderDto.items = items.map((v) => v._id);

      await this.itemModel.updateMany(
        {
          _id: { $in: createOrderDto.items },
        },
        {
          $inc: {
            soldTimes: 1,
          },
        },
        {
          new: true,
        },
      );

      const order = await new this.orderModel({
        ...createOrderDto,
        status: OrderStatusTypes.INPROGRESS,
      }).save();

      return order;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(userId: string, shopId: string) {
    return await this.orderModel.find({ userId, shopId });
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
}
