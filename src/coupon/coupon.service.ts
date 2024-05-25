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

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name) private readonly couponModel: Model<Coupon>,
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<UserDocument>,
  ) {}

  async create(createCouponDto: CreateCouponDto, shopId: string) {
    try {
      const payload = {
        ...createCouponDto,
        shopId,
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
}
