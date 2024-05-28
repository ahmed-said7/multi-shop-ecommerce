import { applyCoupon } from './dto/apply-coupon.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

import mongoose, { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './schemas/coupon.schema';
import { User, UserDocument } from 'src/user/schemas/user_schema';
import { Cart } from 'src/cart/schemas/cart.schema';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name) private readonly couponModel: Model<Coupon>,
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<UserDocument>,
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
  ) {}

  async create(createCouponDto: CreateCouponDto, shopId: string) {
    try {
      const payload = {
        ...createCouponDto,
        shopId: new Types.ObjectId(shopId),
      };

      const checkCoupon = await this.couponModel.findOne({
        text: createCouponDto.text,
      });

      if (checkCoupon) {
        throw new BadRequestException('this coupon already exists');
      }

      const coupon = await new this.couponModel(payload).save();
      return coupon;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(shopId: Types.ObjectId, page: number = 0) {
    try {
      const coupons = await this.couponModel
        .find({
          shopId,
        })
        .limit(10)
        .skip(10 * page);

      return coupons;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: Types.ObjectId) {
    try {
      const coupon = await this.couponModel.findById(id);
      return coupon;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: Types.ObjectId, updateCouponDto: UpdateCouponDto) {
    try {
      const coupon = await this.couponModel.findByIdAndUpdate(
        id,
        updateCouponDto,
        { new: true },
      );

      return coupon;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: Types.ObjectId) {
    try {
      await this.couponModel.findByIdAndDelete(id);

      return 'The coupon was deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async calculateTotalPrice(userId: string, shopId: string): Promise<any> {
    const items = await this.cartModel
      .find({ userId, shopId })
      .populate('itemId', 'name price images');

    if (items.length < 1) {
      throw new NotFoundException(`no item in cart`);
    }

    const totalPrice = items.reduce((total, item) => {
      const itemPrice = (item.itemId as any).price;
      return total + itemPrice * item.quantity;
    }, 0);

    return { items, totalPrice };
  }

  async applyCoupon(userId: string, applyCoupon: applyCoupon): Promise<any> {
    const totalPrice = await this.calculateTotalPrice(
      userId,
      applyCoupon.shopId,
    );

    const coupon = await this.couponModel.findOne({
      text: applyCoupon.text,
      shopId: new Types.ObjectId(applyCoupon.shopId),
    });
    if (!coupon) throw new NotFoundException('Coupon not found');
    if (coupon?.endDate < new Date())
      throw new BadRequestException('Coupon expired');
    if (coupon?.numOfTimes <= 0)
      throw new BadRequestException('Coupon usage limit reached');
    if (!coupon.shopId.equals(applyCoupon.shopId))
      throw new BadRequestException('Coupon not applicable to this shop');

    const discountAmount =
      totalPrice.totalPrice * (coupon.discountPercentage / 100);
    const finalPrice = totalPrice.totalPrice - discountAmount;

    return { items: totalPrice.items, discountAmount, finalPrice };
  }
}
