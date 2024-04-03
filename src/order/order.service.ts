import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as mongoose from 'mongoose';

import { Order, OrderDocument } from './schemas/order_schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtService } from '@nestjs/jwt';
import { request } from 'express';
import { User, UserDocument } from 'src/user/schemas/user_schema';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';


@Injectable()
export class OrderService {
  constructor(
    @InjectModel(User.name) private readonly userModel: mongoose.Model<UserDocument>,
    @InjectModel(Order.name) private readonly orderModel: mongoose.Model<OrderDocument>,
    @InjectModel(Shop.name) private readonly shopModel: mongoose.Model<ShopDocument>,

    private readonly jwtService: JwtService
  ) { }
  async create(createOrderDto: CreateOrderDto) {
    try {
      const userEmail = this.decodeToken(request.headers.authorization.split(' ')[1]).username
      const user = await this.userModel.findOne({ email: userEmail }).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err);
      })
      if (!user) throw new NotFoundException("This user doesn't exist")
      const buyerId=user.id
      const shop= await this.shopModel.findOne({ _id: createOrderDto.shopId }).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err);
      })
      if (!shop) throw new NotFoundException("This shop doesn't exist")
      const sellerId=shop.userID
      if (buyerId == sellerId) throw new UnauthorizedException('You cant make an order from your own shop')
      const priceTotal = createOrderDto.items.reduce((partial, item) => partial + item.price, 0)
      createOrderDto.priceTotal = priceTotal
      const order = await new this.orderModel(createOrderDto).save().catch(err => {
        console.log(err)
        throw new InternalServerErrorException(err)
      })
      return order

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)
    }

  }

  async findAll(buyerId: string, sellerId: string, shopId: string) {
    try {
      const query = { buyerId, sellerId, shopId }

      for (let key in query) {
        if (!query[key]) delete query[key]
      }
      const orders = await this.orderModel.find({ ...query }).populate({ path: "buyerId", model: "User", select: "name email" }).populate({
        path: 'items.itemId',
        model: 'Item',
      }).populate({ path: "sellerId", model: "User", select: "name email" }).exec().catch(err => {
        console.log(err)
        throw new InternalServerErrorException(err)
      })

      return orders
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)
    }
  }


  async findOne(id: string) {
    try {
      const order = await this.orderModel.findById(id).populate("items", "buyerId").catch(err => {
        console.log(err)
        throw new InternalServerErrorException(err)
      })
      return order
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)

    }
  }

  async update(id: string, buyerId: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.orderModel.findById(id).catch(err => {
        console.log(err)
        throw new InternalServerErrorException(err)
      })
      if (order.buyerId != buyerId) throw new UnauthorizedException("You can't adjust an order you didn't create")
      if (updateOrderDto.items) {
        const newTotalPrice = updateOrderDto.items.reduce((partial, item) => partial + item.price, 0)
        updateOrderDto.priceTotal = newTotalPrice
      }
      const newOrder = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).catch(err => {
        console.log(err)
        throw new InternalServerErrorException(err)
      }
      )
      return newOrder
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)

    }
  }

  async remove(id: string) {
    try {
      const userEmail = this.decodeToken(request.headers.authorization.split(' ')[1]).username
      const user = await this.userModel.findOne({ email: userEmail }).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err);
      })
      if (!user) throw new NotFoundException("This user doesn't exist")
      if (user.role != 'admin') throw new UnauthorizedException("You can't delete this order")
      const order = await this.orderModel.findByIdAndDelete(id).catch(err => {
        console.log(err)
        throw new InternalServerErrorException(err)
      })
      return 'Order has been deleted succesfully'
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)
    }
  }
  private decodeToken(token: string) {
    return this.jwtService.decode<{ userId: string; username: string }>(token);
  }
}
