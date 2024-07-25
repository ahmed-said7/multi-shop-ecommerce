import {
  HttpException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { Shop, ShopDocument } from '../shop/schemas/shop_schema';
import { User, UserDocument } from '../user/schemas/user_schema';
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Shop.name)
    private readonly shopModel: mongoose.Model<ShopDocument>,
    private i18n:CustomI18nService
  ) {};

  async findOne(id: string) {
      const foundUser = await this.userModel.findById(id).select("-password");
      if (!foundUser) throw new NotFoundException(this.i18n.translate("test.user.notFound"));
      return { foundUser };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto , { new: true })
      .select("-password");
      if (!updatedUser) throw new NotFoundException(this.i18n.translate("test.user.notFound"));
    return { updatedUser };
  };

  async remove( deleteId: string) {
    const deletedUser = this.userModel.findByIdAndDelete(deleteId);
    if (!deletedUser) {
      throw new NotFoundException(this.i18n.translate("test.user.notFound"));
    };
    return { status : this.i18n.translate("test.user.deleted")};
  };


  async getUsersPerMonth() {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const result = await this.userModel.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
      {
        $addFields: {
          month: {
            $dateToString: {
              format: '%Y-%m',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: 1,
                },
              },
            },
          },
          count: '$count',
        },
      },
      {
        $project: {
          _id: 0, 
          month: 1,
          count: 1,
        },
      },
    ]);

  if (result.length === 0) {
    throw new HttpException(this.i18n.translate("test.user.statistics"), 400);
  };

  return { data: result };

};

  async getShopsPerMonth() {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const result = await this.shopModel.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
      {
        $addFields: {
          month: {
            $dateToString: {
              format: '%Y-%m',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: 1,
                },
              },
            },
          },
          count: '$count',
        },
      },
      {
        $project: {
          _id: 0, 
          month: 1,
          count: 1
        },
      },
    ]);

    if (result.length === 0) {
      throw new HttpException(this.i18n.translate("test.user.statistics"), 400);
    }

    return { data: result };
  }
};
