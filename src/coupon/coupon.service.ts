import { applyCoupon } from './dto/apply-coupon.dto';
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './schemas/coupon.schema';
import { Cart } from 'src/cart/schemas/cart.schema';
import { ApiService } from 'src/common/filter/api.service';
import { QueryCouponDto } from './dto/query-coupon.dto';
import { Model } from 'mongoose';
import { CartService } from 'src/cart/cart.service';
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name) private readonly couponModel: Model<Coupon>,
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    private apiService: ApiService<Coupon, QueryCouponDto>,
    private cartService: CartService,
    private i18n: CustomI18nService,
  ) {}

  async create(createCouponDto: CreateCouponDto, shopId: string) {
    const checkCoupon = await this.couponModel.findOne({
      text: createCouponDto.text,
    });

    if (checkCoupon) {
      throw new BadRequestException(
        this.i18n.translate('test.coupon.duplicate'),
      );
    }

    const coupon = await this.couponModel.create({
      ...createCouponDto,
      shopId: shopId.toString(),
    });
    return { coupon };
  }

  async findAll(query: QueryCouponDto, shopId: string) {
    query.shopId = shopId;
    console.log(query);
    const { query: result, paginationObj } = await this.apiService.getAllDocs(
      this.couponModel.find(),
      query,
    );
    const coupons = await result;
    if (coupons.length == 0) {
      throw new HttpException(this.i18n.translate('test.coupon.notFound'), 400);
    }
    return { coupons, pagination: paginationObj };
  }

  async findOne(id: string, shopId: string) {
    const coupon = await this.couponModel.findOne({ _id: id, shopId });
    if (!coupon) {
      throw new NotFoundException(this.i18n.translate('test.coupon.notFound'));
    }
    return { coupon };
  }

  async update(id: string, shopId: string, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.couponModel.findOneAndUpdate(
      { _id: id, shopId },
      updateCouponDto,
      { new: true },
    );
    if (!coupon) {
      throw new NotFoundException(this.i18n.translate('test.coupon.notFound'));
    }
    return { coupon };
  }

  async remove(id: string, shopId: string) {
    const coupon = await this.couponModel.findOneAndDelete({ _id: id, shopId });
    if (!coupon) {
      throw new NotFoundException(this.i18n.translate('test.coupon.notFound'));
    }
    return { status: this.i18n.translate('test.coupon.deleted') };
  }

  async applyCoupon(userId: string, applyCoupon: applyCoupon): Promise<any> {
    const { totalPrice, items } = await this.cartService.getCart(
      userId,
      applyCoupon.shopId,
    );
    const coupon = await this.couponModel.findOne({
      text: applyCoupon.text,
      shopId: applyCoupon.shopId,
    });
    if (!coupon)
      throw new NotFoundException(this.i18n.translate('test.coupon.notFound'));
    if (coupon?.endDate < new Date())
      throw new BadRequestException(this.i18n.translate('test.coupon.expired'));
    if (coupon?.numOfTimes <= 0)
      throw new BadRequestException(this.i18n.translate('test.coupon.limit'));
    if (coupon.shopId.toString() != applyCoupon.shopId)
      throw new BadRequestException(
        this.i18n.translate('test.coupon.applicable'),
      );
    const discountAmount = totalPrice * (coupon.discountPercentage / 100);
    const finalPrice = totalPrice - discountAmount;
    coupon.numOfTimes -= 1;
    await coupon.save();
    return { items, discountAmount, finalPrice };
  }
}
