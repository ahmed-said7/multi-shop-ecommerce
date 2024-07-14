import {
  HttpException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from 'src/order/schemas/order_schema';
import { Item, ItemDocument } from 'src/item/schemas/item-schema';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { IAuthUser } from 'src/common/enums';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Shop.name) private readonly shopModel: Model<ShopDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>
  ) {};

  async findOne(user: IAuthUser, body:CreateReportDto ) {
      const shopId = user.shopId;
      const { year,report,month }=body;
      let result: any;
      switch (report) {
        case 'monthlySales':
          const reportYear = year
          const reportMonth = month;
          result = await this.generateMonthlySalesReport(
            shopId.toString(),
            reportYear,
            reportMonth,
          );
          return { monthlySales:result };
        case 'itemSales':
          result = await this.generateItemSalesReport(shopId.toString());
          return { itemSales : result };
        case 'itemRatings':
          result = await this.getShopItemRatings(shopId.toString());
          return { itemRatings:result };
        case 'orderMetrics':
          result = await this.getShopOrdersMetrics(shopId.toString());
          return { orderMetrics : result };
      }
  }

  async generateMonthlySalesReport(
    shopId: string,
    year: number,
    month: number,
  ) {
    const monthlySales = await this.orderModel.aggregate([
      {
        $match: {
          shopId: shopId,
          createdAt: {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1),
          }
        },
      },
      {
        $unwind: '$cartItems',
      },
      {
        $group: {
          _id: '$cartItems.product',
          totalSales: { $sum: '$cartItems.quantity' },
        },
      },
    ]);

    const result=monthlySales.map(async ({_id,count})=>{
      const item= await this.itemModel.findById(_id);
      return { item , count }
    });

    return result;

  }

  async generateItemSalesReport(shopId: string) {
    const itemSales = await this.orderModel.aggregate([
      {
        $match: { shopId: shopId },
      },
      {
        $unwind: '$cartItems',
      },
      {
        $group: {
          _id: '$cartItems.product',
          totalSales: { $sum: '$items.quantity' },
        },
      },
    ]);

    const result = itemSales.map(async ({_id,count})=>{
      const item= await this.itemModel.findById(_id);
      return { item , count };
    });

    return result;
  };

  async getShopItemRatings(shopId: string) {
    const shop = await this.shopModel.findById(shopId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const ratingsMap = await this.itemModel.aggregate([
      { $match : { shopId } } ,
      { 
        $group : {
          _id:"$rating",
          count:{$sum:1}
        } 
      },
      ,
      {
        $addFields : { "rating":"$_id" , _id:0 }
      },
      {
        $sort: { "count" : -1 }
      },
      {
        $limit:1
      }
    ])
    return ratingsMap[0];
  };

  async getShopCustomerCount(shopId: string) {
    const shop = await this.shopModel.findById(shopId);
    if(!shop){
      throw new HttpException("shop not found",400);
    };
    return { customers:shop.customers.length };
  }

  async getShopOrdersMetrics(shopId: string) {
    const shop = await this.shopModel.findById(shopId);
    if (!shop) {
      throw new NotFoundException('Shop not found');
    };
    
    const hoursWithMostOrders=await this.orderModel.aggregate([
      { $match : {shopId} },
      {
        $group : {
          _id : { 
            day:{ $hour: '$createdAt'  }
          },
          count:{$sum:1}
        }
      },
      {
        $addFields : { "hour":"$_id.hour" , _id:0 }
      },
      {
        $sort: { "count" : -1 }
      },
      {
        $limit:1
      }
    ]);
    const daysWithMostOrders=await this.orderModel.aggregate([
      { $match : {shopId} },
      {
        $group : {
          _id : { 
            day:{ $day: '$createdAt'  }
          },
          count:{$sum:1}
        }
      },
      {
        $addFields : { "day":"$_id.day" , _id:0 }
      },
      {
        $sort: { "count" : -1 }
      },
      {
        $limit:1
      }
    ]);
    const buyerWithMostOrders=await this.orderModel.aggregate([
      { $match : {shopId} },
      {
        $group : {
          _id : "userId",
          count:{$sum:1}
        }
      },
      {
        $addFields : { "userId":"$_id" , _id:0 }
      },
      {
        $sort: { "count" : -1 }
      },
      {
        $limit:1
      }
    ]);
    return {
      buyerWithMostOrders:buyerWithMostOrders[0],
      daysWithMostOrders:daysWithMostOrders[0],
      hoursWithMostOrders:hoursWithMostOrders[0]
    }
  };
}
