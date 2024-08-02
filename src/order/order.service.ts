import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './schemas/order_schema';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { Cart } from 'src/cart/schemas/cart.schema';
import { CouponService } from 'src/coupon/coupon.service';
import { AllRoles, IAuthUser, OrderStatusTypes } from 'src/common/enums';
import { CartService } from 'src/cart/cart.service';
import { Item, ItemDocument } from 'src/item/schemas/item-schema';
import { QueryOrderDto } from './dto/order-query.dto';
import { ApiService } from 'src/common/filter/api.service';
import { Model } from 'mongoose';
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Shop.name)
    private readonly shopModel: Model<ShopDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: Model<Cart>,
    private readonly couponService: CouponService,
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    private cartService: CartService,
    private apiService: ApiService<OrderDocument, QueryOrderDto>,
    private i18n: CustomI18nService,
  ) {}
  private orderItems(items: any, price: number, body: CreateOrderDto) {
    body.priceTotal = price;
    body.cartItems = items.map((item) => {
      const {
        color,
        size,
        quantity,
        itemId: { _id },
      } = item;
      return { product: _id, color, size, quantity };
    });
  }
  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { shopId, couponName } = createOrderDto;
    const shop = await this.shopModel.findById(shopId);
    if (!shop) {
      throw new NotFoundException(this.i18n.translate('test.shop.notFound'));
    }
    if (couponName) {
      const { items, finalPrice } = await this.couponService.applyCoupon(
        userId,
        { shopId, text: couponName },
      );
      this.orderItems(items, finalPrice, createOrderDto);
    } else {
      const { totalPrice, items } = await this.cartService.getCart(
        userId,
        shopId,
      );
      this.orderItems(items, totalPrice, createOrderDto);
    }
    const order = await this.orderModel.create({
      ...createOrderDto,
      userId,
      status: OrderStatusTypes.INPROGRESS,
    });

    await this.cartModel.deleteMany({ userId, shopId });

    const promises = order.cartItems.map((item) => {
      return this.itemModel.findByIdAndUpdate(item.product, {
        $inc: { soldTimes: item.quantity },
      });
    });

    await Promise.all(promises);

    // Clear the user'suserId: string, shopId: string, couponName: string, applyCoupon: applyCouponme: string, applyCoupon: applyCouponMany({ userId, shopId });

    return { order };
  }

  async findAllOrders(query: QueryOrderDto, user: IAuthUser) {
    if (user.role == AllRoles.USER) {
      query.userId = user._id;
    } else if (user.role == AllRoles.MERCHANT) {
      query.shopId = user.shopId;
    }

    const { query: result, paginationObj } = await this.apiService.getAllDocs(
      this.orderModel.find(),
      query,
    );

    result.populate({ path: 'carItems.product', select: 'name price images' });
    if (user.role != AllRoles.USER) {
      result
        .populate({ path: 'userId', select: 'name email' })
        .populate({ path: 'shopId', select: 'name description' });
    }
    const orders = await result;

    if (orders.length == 0) {
      throw new HttpException(this.i18n.translate('test.order.notFound'), 400);
    }

    return { orders, pagination: paginationObj };
  }

  async findOne(id: string, user: IAuthUser) {
    let filter = {};
    if (user.role == AllRoles.MERCHANT) {
      filter = { shopId: user.shopId };
    } else if (user.role == AllRoles.USER) {
      filter = { userId: user._id };
    }
    const query = this.orderModel
      .findOne({ _id: id, ...filter })
      .populate({ path: 'carItems.product', select: 'name price images' });
    if (user.role != AllRoles.USER) {
      query.populate({ path: 'userId', select: 'name email' });
    }
    const order = await query;
    if (!order) {
      throw new HttpException(this.i18n.translate('test.order.notFound'), 400);
    }
    return { order };
  }

  // only admin
  async remove(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id);
    if (!order) {
      throw new HttpException('order not found', 400);
    }
    return order;
  }

  // only admin
  async confimeDelivery(id: string) {
    const order = await this.orderModel.findOneAndUpdate(
      { _id: id },
      {
        status: OrderStatusTypes.DELIVERED,
        delivered: true,
      },
      { new: true },
    );
    if (!order) {
      throw new HttpException(this.i18n.translate('test.order.notFound'), 400);
    }
    return { order };
  }

  // only admin
  async confimePaid(id: string) {
    const order = await this.orderModel.findOneAndUpdate(
      { _id: id },
      {
        paid: true,
      },
      { new: true },
    );
    if (!order) {
      throw new HttpException(this.i18n.translate('test.order.notFound'), 400);
    }
    return { order };
  }
}
