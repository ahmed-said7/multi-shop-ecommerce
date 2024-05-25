import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import moment from 'moment';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Order, OrderDocument } from 'src/order/schemas/order_schema';
import { Item, ItemDocument } from 'src/item/schemas/item-schema';
import { User, UserDocument } from 'src/user/schemas/user_schema';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Shop.name) private readonly shopModel: Model<ShopDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findOne(userId: string, report: string, year?: string, month?: string) {
    try {
      const user = await this.userModel.findById(userId);

      if (user.role != 'shop_owner') {
        throw new UnauthorizedException("You don't have a shop");
      }

      const shopId = user.shopId;

      let result: any;

      user.password = undefined;
      switch (report) {
        case 'monthlySales':
          const reportYear = parseInt(year);
          const reportMonth = parseInt(month);
          result = await this.generateMonthlySalesReport(
            shopId.toString(),
            reportYear,
            reportMonth,
          );
          return { result };
        case 'itemSales':
          result = await this.generateItemSalesReport(shopId.toString());
          return { result };
        case 'itemRatings':
          result = await this.getShopItemRatings(shopId.toString());
          return { result };
        case 'orderMetrics':
          result = await this.getShopOrdersMetrics(shopId.toString());
          return { result };
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
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
    ]);

    const result = new Map<string, number>();

    monthlySales.forEach((entry: { _id: string; totalSales: number }) => {
      result.set(entry._id, entry.totalSales);
    });

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
    ]);

    const result = new Map<string, number>();

    itemSales.forEach((entry: { _id: string; totalSales: number }) => {
      result.set(entry._id, entry.totalSales);
    });

    return result;
  }

  async getShopItemRatings(shopId: string): Promise<Map<number, number>> {
    const shop = await this.shopModel.findById(shopId).exec();

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const items = await this.itemModel
      .find({ _id: { $in: shop.itemsIDs } })
      .exec();

    const ratingsMap = new Map<number, number>();

    items.forEach((item) => {
      const rating = item.rating || 0;
      ratingsMap.set(rating, (ratingsMap.get(rating) || 0) + 1);
    });

    return ratingsMap;
  }

  async getShopCustomerCount(shopId: string): Promise<number> {
    const shop = await this.shopModel.findById(shopId).exec();

    return shop.customers.length;
  }

  async getShopOrdersMetrics(shopId: string): Promise<Map<string, any>> {
    const shop = await this.shopModel.findById(shopId).exec();

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const orders = await this.orderModel.find({ shopID: shopId }).exec();

    const hoursWithMostOrders = this.calculateMostOrdersByHour(orders);
    const daysWithMostOrders = this.calculateMostOrdersByDay(orders);
    const buyersWithMostOrders = this.calculateMostOrdersByBuyer(orders);

    const data = new Map<string, any>();

    data.set('hoursWithMostOrders', hoursWithMostOrders);
    data.set('daysWithMostOrders', daysWithMostOrders);
    data.set('buyersWithMostOrders', buyersWithMostOrders);

    return data;
  }

  private calculateMostOrdersByHour(orders: OrderDocument[]) {
    const orderCountsByHour = new Map<number, number>();

    orders.forEach((order) => {
      const orderHour = moment(order?.['createdAt']).hour();
      orderCountsByHour.set(
        orderHour,
        (orderCountsByHour.get(orderHour) || 0) + 1,
      );
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
      const orderDay = moment(order?.['createdAt']).format('dddd');
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
      const buyerId = order.userId;
      orderCountsByBuyer.set(
        buyerId,
        (orderCountsByBuyer.get(buyerId) || 0) + 1,
      );
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
