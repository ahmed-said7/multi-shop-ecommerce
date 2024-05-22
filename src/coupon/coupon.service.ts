import {
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

  async create(createCouponDto: CreateCouponDto, userId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new NotFoundException('There is no user with this id');
      const payload = {
        ...createCouponDto,
        shop: user.shopId,
      };
      const coupon = await new this.couponModel(payload).save().catch((err) => {
        if (err.code == 11000) {
          console.log(err);
          throw new InternalServerErrorException('This coupon already exists');
        } else {
          console.log(err);
          throw new InternalServerErrorException(err);
        }
      });

      return coupon;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(shop: Types.ObjectId, page: number = 0) {
    try {
      const coupons = await this.couponModel
        .find({
          shop,
        })
        .limit(10)
        .skip(10 * page)
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });

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

  async update(
    id: Types.ObjectId,
    shopId: string,
    updateCouponDto: UpdateCouponDto,
  ) {
    try {
      const coupon = await this.couponModel.updateOne(
        { id, shopId },
        updateCouponDto,
        { new: true },
      );

      return coupon;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: Types.ObjectId, shopId: string) {
    try {
      await this.couponModel.deleteOne({ id, shopId });

      return 'The coupon was deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async addCustomer(id: Types.ObjectId, customer: Types.ObjectId) {
    try {
      const updatedCoupon = await this.couponModel.findByIdAndUpdate(id, {
        $push: {
          subscriptCustomers: customer,
        },
      });
      if (!updatedCoupon)
        throw new NotFoundException("This coupon doesn't exist!");
      return updatedCoupon;
    } catch (error) {
      throw new InternalServerErrorException(error, "Can't Add Customer");
    }
  }

  async addItem(id: Types.ObjectId, item: Types.ObjectId) {
    try {
      const updatedCoupon = await this.couponModel.findByIdAndUpdate(id, {
        $push: {
          items: item,
        },
      });
      if (!updatedCoupon)
        throw new NotFoundException("This coupon doesn't exist!");
      return updatedCoupon;
    } catch (error) {
      throw new InternalServerErrorException(error, "Can't Add Item");
    }
  }

  async changeDiscount(id: string, discount: number) {
    try {
      const updatedCoupon = await this.couponModel.findByIdAndUpdate(id, {
        discountPercentage: discount,
      });
      if (!updatedCoupon)
        throw new NotFoundException("This coupon doesn't exist!");
      return updatedCoupon;
    } catch (error) {
      throw new InternalServerErrorException(error, "Can't Add Item");
    }
  }
}
