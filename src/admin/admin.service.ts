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

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Shop.name)
    private readonly shopModel: mongoose.Model<ShopDocument>,
  ) {};

  async findOne(id: string) {
      const foundUser = await this.userModel.findById(id).select("-password");
      if (!foundUser) throw new NotFoundException('This user doesnt exist');
      return { foundUser };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto , { new: true })
      .select("-password");
      if (!updatedUser) throw new NotFoundException('This user doesnt exist');
    return { updatedUser };
  };

  async remove( deleteId: string) {
    const deletedUser = this.userModel.findByIdAndDelete(deleteId);
    if (!deletedUser) {
      throw new NotFoundException('User to delete not found');
    };
    return { status : 'User Deleted Successfully'};
  };

  async getUsersPerMonth() {
    const now = new Date();

    const twelveMonthsAgo = new Date( now.getFullYear(), now.getMonth() - 11, 1 );

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
    ]);
    if( result.length == 0 ){
      throw new HttpException("data not found",400)
    };
    // Prepare the result array with counts for the last 12 months
    const mappedData = result.map(({ _id: { month, year } ,  count }) => (
      { month : `${year}-${ month < 10 ? '0' + month : month } `, count }
    ));

    return { data : mappedData };
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
    ]);
    
    if( result.length == 0 ){
      throw new HttpException("data not found",400)
    };
    // Prepare the result array with counts for the last 12 months
    const mappedData = result.map(({ _id: { month, year }, count }) => ({
      month: `${year}-${month < 10 ? '0' + month : month}`,
      count,
    }));

    return { data : mappedData };
  };
};
