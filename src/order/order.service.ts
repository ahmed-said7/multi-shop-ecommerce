import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';

import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './schemas/order_schema';

import { User, UserDocument } from 'src/user/schemas/user_schema';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { Item, ItemDocument } from 'src/item/schemas/item-schema';

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

    private readonly jwtService: JwtService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException("This user doesn't exist");
      }

      const shop = await this.shopModel.findById(createOrderDto.shopId);

      if (!shop) throw new NotFoundException("This shop doesn't exist");

      const sellerId = shop.userID;

      const buyerId = user._id;

      if (userId == sellerId) {
        throw new UnauthorizedException(
          'You cant make an order from your own shop',
        );
      }

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

      createOrderDto.buyerId = buyerId;
      createOrderDto.sellerId = sellerId;

      const order = await new this.orderModel(createOrderDto).save();

      return order;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(buyerId: string, sellerId: string, shopId: string) {
    try {
      const query = { buyerId, sellerId, shopId };

      const orders = await this.orderModel
        .find({ ...query })
        .populate({ path: 'buyerId', model: 'User', select: 'name email' })
        .populate({
          path: 'items.itemId',
          model: 'Item',
        })
        .populate({ path: 'sellerId', model: 'User', select: 'name email' })
        .exec()
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });

      return orders;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const order = await this.orderModel
        .findById(id)
        .populate('items', 'buyerId')
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      return order;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(userId: string, id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.orderModel.findById(id);

      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException("This user doesn't exist");
      }

      const buyerId = user.id;

      if (order.buyerId != buyerId) {
        throw new UnauthorizedException(
          "You can't adjust an order you didn't create",
        );
      }

      //TODO: This code isn't working.
      if (updateOrderDto.items) {
        const items = await this.itemModel.find({
          _id: { $in: updateOrderDto.items },
        });
        if (items.length != updateOrderDto.items.length)
          throw new BadRequestException('Some items are not found');

        let newTotalPrice = 0;
        items.forEach((item) => {
          newTotalPrice += item.price;
        });
        updateOrderDto.priceTotal = newTotalPrice;
      }

      const newOrder = await this.orderModel.findByIdAndUpdate(
        id,
        updateOrderDto,
        { new: true },
      );

      return newOrder;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
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
  private decodeToken(token: string) {
    return this.jwtService.decode<{ userId: string; username: string }>(token);
  }
}
