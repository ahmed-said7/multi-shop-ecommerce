import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from 'src/order/schemas/order_schema';
import { Item, ItemDocument } from 'src/item/schemas/item-schema';
import { User, UserDocument } from 'src/user/schemas/user_schema';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import moment from 'moment';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Shop.name) private readonly shopModel: Model<ShopDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) { }

  private decodeToken(token: string) {
    return this.jwtService.decode<{ userId: string; username: string }>(token);
  }
  async findOne(request:any, shopId: string, report: string, year?: string, month?: string) {
    try {
      const userEmail = this.decodeToken(request.headers.authorization.split(' ')[1]).username
      const user = await this.userModel.findOne({ email: userEmail }).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err);
      })
      if (!user) throw new NotFoundException('There is no user with this id')
      if (user.role != 'shop_owner') throw new UnauthorizedException("You don't have a shop")
      if (user.shop != shopId) throw new UnauthorizedException("You can't get the reports for another user's shop!")
      let result
      user.password=undefined
      switch (report) {
        case "monthlySales":
          const reportYear = parseInt(year)
          const reportMonth = parseInt(month)
          result = this.generateMonthlySalesReport(shopId, reportYear, reportMonth)
          return { user, result }
        case "itemSales":
          result = this.generateItemSalesReport(shopId)
          return { user, result }
        case "itemRatings":
          result = this.getShopItemRatings(shopId)
          return { user, result }
        case "orderMetrics":
          result = this.getShopOrdersMetrics(shopId)
          return { user, result }
      }

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }

  async generateMonthlySalesReport(
    shopId: string,
    year: number,
    month: number,
  ): Promise<Map<string, number>> {
    const monthlySales = await this.orderModel.aggregate([
      {
        $match: {
          shopID: shopId,
          createdAt: {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1),
          },
        },
      },
      {
        $group: {
          _id: '$items.itemID',
          totalSales: { $sum: '$items.price' },
        },
      },
    ]).catch(err => {
      console.log(err)
      throw new InternalServerErrorException('Unexpected error happened when aggregating!')
    });

    const result = new Map<string, number>();

    monthlySales.forEach(
      (entry: { _id: string; totalSales: number }) => {
        result.set(entry._id, entry.totalSales);
      },
    );

    return result;
  }

  async generateItemSalesReport(shopId: string): Promise<Map<string, number>> {
    const itemSales = await this.orderModel.aggregate([
      {
        $match: { shopID: shopId },
      },
      {
        $unwind: '$items',
      },
      {
        $group: {
          _id: '$items.itemID',
          totalSales: { $sum: '$items.price' },
        },
      },
    ]).catch(err => {
      console.log(err)
      throw new InternalServerErrorException('Unexpected error happened while aggregating!')
    });

    const result = new Map<string, number>();

    itemSales.forEach(
      (entry: { _id: string; totalSales: number }) => {
        result.set(entry._id, entry.totalSales);
      },
    );

    return result;
  }

  async getShopItemRatings(shopId: string): Promise<Map<number, number>> {
    const shop = await this.shopModel.findById(shopId).exec().catch(err => {
      console.log(err)
      throw new InternalServerErrorException('Unexpected error happened while finding the shop!')
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const items = await this.itemModel.find({ _id: { $in: shop.itemsIDs } }).exec().catch(err => {
      console.log(err)
      throw new InternalServerErrorException('Unexpected error happened while finding the items!')
    });

    const ratingsMap = new Map<number, number>();

    items.forEach((item) => {
      const rating = item.rating || 0;
      ratingsMap.set(rating, (ratingsMap.get(rating) || 0) + 1);
    });

    return ratingsMap;
  }

  async getShopCustomerCount(shopId: string): Promise<number> {
    const shop = await this.shopModel.findById(shopId).exec().catch(err => {
      console.log(err)
      throw new InternalServerErrorException('Unexpected error happened while finding the shop!')
    });
    return shop.customers.length;
  }

  async getShopOrdersMetrics(shopId: string) {

    const shop = await this.shopModel.findById(shopId).exec().catch(err => {
      console.log(err)
      throw new InternalServerErrorException('Unexpected error happened while finding the shop!')
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }


    const orders = await this.orderModel.find({ shopID: shopId }).exec().catch(err => {
      console.log(err)
      throw new InternalServerErrorException('Unexpected error happened while finding the orders!')
    });


    const hoursWithMostOrders = this.calculateMostOrdersByHour(orders);
    const daysWithMostOrders = this.calculateMostOrdersByDay(orders);
    const buyersWithMostOrders = this.calculateMostOrdersByBuyer(orders);

    return {
      hoursWithMostOrders,
      daysWithMostOrders,
      buyersWithMostOrders,
    };
  }
  private calculateMostOrdersByHour(orders: OrderDocument[]) {
    const orderCountsByHour = new Map<number, number>();

    orders.forEach((order) => {
      const orderHour = moment(order.createdAt).hour();
      orderCountsByHour.set(orderHour, (orderCountsByHour.get(orderHour) || 0) + 1);
    });


    let mostOrdersHour: number;
    let mostOrdersCount = 0;

    orderCountsByHour.forEach((count, hour) => {
      if (count > mostOrdersCount) {
        mostOrdersCount = count;
        mostOrdersHour = hour;
      }
    });

    return {
      mostOrdersHour,
      mostOrdersCount,
    };
  }

  private calculateMostOrdersByDay(orders: OrderDocument[]) {
    const orderCountsByDay = new Map<string, number>();

    orders.forEach((order) => {
      const orderDay = moment(order.createdAt).format('dddd');
      orderCountsByDay.set(orderDay, (orderCountsByDay.get(orderDay) || 0) + 1);
    });

    let mostOrdersDay: string;
    let mostOrdersCount = 0;

    orderCountsByDay.forEach((count, day) => {
      if (count > mostOrdersCount) {
        mostOrdersCount = count;
        mostOrdersDay = day;
      }
    });

    return {
      mostOrdersDay,
      mostOrdersCount,
    };
  }

  private calculateMostOrdersByBuyer(orders: OrderDocument[]) {
    const orderCountsByBuyer = new Map<string, number>();

    orders.forEach((order) => {
      const buyerId = order.buyerId;
      orderCountsByBuyer.set(buyerId, (orderCountsByBuyer.get(buyerId) || 0) + 1);
    });

    let mostOrdersBuyerId: string;
    let mostOrdersCount = 0;

    orderCountsByBuyer.forEach((count, buyerId) => {
      if (count > mostOrdersCount) {
        mostOrdersCount = count;
        mostOrdersBuyerId = buyerId;
      }
    });

    return {
      mostOrdersBuyerId,
      mostOrdersCount,
    };
  }
}
