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
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Shop.name) private readonly shopModel: Model<ShopDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
    private i18n:CustomI18nService
  ) {};

  async findOne(user: IAuthUser, body:CreateReportDto ) {
      const shopId = user.shopId;
      const { year,report,month }=body;
      let result: any;
      switch (report) {
        case 'monthlySales':
          const reportYear = year || new Date().getFullYear();
          const reportMonth = month || new Date().getMonth() + 1;
          result = await this.generateMonthlySalesReport(
            shopId,
            reportYear,
            reportMonth,
          );
          return { monthlySales:result };
        case 'itemSales':
          result = await this.generateItemSalesReport(shopId);
          return { itemSales : result };
        case 'itemRatings':
          result = await this.getShopItemRatings(shopId);
          return { itemRatings:result };
        case 'orderMetrics':
          result = await this.getShopOrdersMetrics(shopId);
          return { orderMetrics : result };
        case 'mostProfitable':
          result = await this.getTheMostProfitableItems(shopId);
          return { mostProfitable : result };
          // MostProfitable
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
          shopId: shopId
          ,createdAt: {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1),
          }
        }
      },
      {
        $unwind: '$cartItems'
      },
      {
        $lookup: {
          from: "items",
          localField: 'cartItems.product',
          foreignField: '_id',
          as: 'cartItems.product'
        }
      },{ $unwind: '$cartItems.product' }
      ,{
        $group: {
          _id: '$cartItems.product._id',
          quantity: { $sum: '$cartItems.quantity' },
          name:{$first:"$cartItems.product.name"},
          price:{$first:"$cartItems.product.price"},
          images:{$first:"$cartItems.product.images"}
        }
      },
      {
        $project : {
          _id:0
        }
      },
      {
        $sort:{quantity:-1}
      }
    ]);
    if( monthlySales.length == 0 ){
      throw new NotFoundException(this.i18n.translate("test.report.notFound"));
    };
    return monthlySales;

  }

  async generateItemSalesReport(shopId: string) {
    const itemSales = await this.orderModel.aggregate([
      {
        $match: {
          shopId: shopId
        }
      },
      {
        $unwind: '$cartItems'
      },
      {
        $lookup: {
          from: "items",
          localField: 'cartItems.product',
          foreignField: '_id',
          as: 'cartItems.product'
        }
      },{ $unwind: '$cartItems.product' }
      ,{
        $group: {
          _id: '$cartItems.product._id',
          quantity: { $sum: '$cartItems.quantity' },
          name:{$first:"$cartItems.product.name"},
          price:{$first:"$cartItems.product.price"},
          images:{$first:"$cartItems.product.images"}
        }
      },
      {
        $project : {
          _id:0
        }
      },
      {
        $sort:{quantity:-1}
      }
    ]);
    if( itemSales.length == 0 ){
      throw new NotFoundException(this.i18n.translate("test.report.notFound"));
    };
    return itemSales;
  };


  async getShopItemRatings(shopId: string) {
    const shop = await this.shopModel.findById(shopId);

    if (!shop) {
      throw new NotFoundException(this.i18n.translate("test.shop.notFound"));
    }

    const ratingsMap = await this.itemModel.aggregate([
      { $match : { shopId } } ,
      { 
        $group : {
          _id:"$rating",
          count:{$sum:1}
        } 
      },
      {
        $addFields : { "rating":"$_id" }
      },
      {
        $sort: { "count" : -1 }
      },
      {
        $limit:1
      }
    ])
    if( ratingsMap.length == 0 ){
      throw new NotFoundException(this.i18n.translate("test.report.notFound"));
    };
    return ratingsMap[0];
  };

  async getShopCustomerCount(shopId: string) {
    const shop = await this.shopModel.findById(shopId);
    if(!shop){
      throw new HttpException(this.i18n.translate("test.shop.notFound"),400);
    };
    return { customers:shop.customers.length };
  }

  async getShopOrdersMetrics(shopId: string) {
    const shop = await this.shopModel.findById(shopId);
    if (!shop) {
      throw new NotFoundException(this.i18n.translate("test.shop.notFound"));
    };
    
  const hoursWithMostOrders = await this.orderModel.aggregate([
  { $match: { shopId } },
  {
    $group: {
      _id: { hour: { $hour: '$createdAt' } },
      count: { $sum: 1 }
    }
  },
  {
    $addFields: { hour: '$_id.hour', _id: 0 }
  },
  {
    $sort: { count: -1 }
  },
  {
    $limit: 1
  }
  ]);
  const daysWithMostOrders = await this.orderModel.aggregate([
    { $match: { shopId } },
    {
      $group: {
        _id: { day: { $dayOfMonth: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    {
      $addFields: { day: '$_id.day', _id: 0 }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 1
    }
  ]);
  const buyerWithMostOrders = await this.orderModel.aggregate([
    { $match: { shopId } },
    {
      $group: {
        _id: '$userId',
        count: { $sum: 1 }
      }
    },
    {
      $addFields: { userId: '$_id', _id: 0 }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 1
    }
  ]);
    if( buyerWithMostOrders.length == 0 && daysWithMostOrders.length == 0 && hoursWithMostOrders.length == 0 ){
      throw new NotFoundException(this.i18n.translate("test.report.notFound"));
    };
    return {
      buyerWithMostOrders:buyerWithMostOrders[0],
      daysWithMostOrders:daysWithMostOrders[0],
      hoursWithMostOrders:hoursWithMostOrders[0]
    }
  };

  async getTheMostProfitableItems(shopId:string){
    const mostProfitable = await this.orderModel.aggregate([
      {
        $match: {
          shopId: shopId
        }
      },
      {
        $unwind: '$cartItems'
      },
      {
        $lookup: {
          from: "items",
          localField: 'cartItems.product',
          foreignField: '_id',
          as: 'cartItems.product'
        }
      },{ $unwind: '$cartItems.product' }
      ,{
        $group: {
          _id: '$cartItems.product._id',
          quantity: { $sum: '$cartItems.quantity' },
          name:{$first:"$cartItems.product.name"},
          price:{$first:"$cartItems.product.price"},
          images:{$first:"$cartItems.product.images"},
        }
      },
      {
        $project : {
          _id:0,
          profit: { $multiply: ["$quantity", "$price"] },
          name:1,price:1,images:1,quantity:1
        }
      },
      {
        $sort : { 
          profit:-1
        }
      }
    ]);
    if( mostProfitable.length == 0 ){
      throw new HttpException(this.i18n.translate("test.report.notFound"),400);
    };
    return mostProfitable;
  };
};
