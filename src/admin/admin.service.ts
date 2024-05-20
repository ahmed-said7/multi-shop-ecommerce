import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User, UserDocument } from 'src/user/schemas/user_schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Shop.name)
    private readonly shopModel: mongoose.Model<ShopDocument>,
    private readonly jwtService: JwtService,
  ) {}

  private decodeToken(token: string) {
    return this.jwtService.decode<{ username: string; email: string }>(token);
  }
  async findOne(id: string) {
    try {
      const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
      const idValid = checkForHexRegExp.test(id);
      if (!idValid) throw new BadRequestException('Please enter correct Id');
      const foundUser = await this.userModel.findById(id).catch((err) => {
        console.log(err);
        throw new NotFoundException(
          'An unexpected error happened while finding the user!',
        );
      });
      if (!foundUser) throw new NotFoundException('This user doesnt exist');
      foundUser.password = undefined;
      return foundUser;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('An unexpected error happened!');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const { ...data } = updateUserDto;
      const user = await this.userModel.findById(id);

      if (user.role === 'admin') {
        const updatedUser = await this.userModel
          .findByIdAndUpdate(user._id, data, { new: true })
          .catch((err) => {
            console.log(err);
            throw new InternalServerErrorException(
              'Unexpected error while updating user',
            );
          });
        updatedUser.password = undefined;
        return updatedUser;
      } else {
        throw new UnauthorizedException('Unathorized error');
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log(error);
      throw new InternalServerErrorException('An unexpected error happened!');
    }
  }

  async remove(userId: string, deleteId: string) {
    try {
      const user = await this.userModel.findById(userId).catch((err) => {
        console.log(err);
        throw new NotFoundException('This user doesnt exist');
      });
      if (!user) throw new NotFoundException('This user doesnt exist');
      if (user.role == 'admin' || userId == deleteId) {
        const deletedUser = this.userModel
          .findByIdAndDelete(deleteId)
          .catch((err) => {
            console.log(err);
            throw new InternalServerErrorException(
              'Unexpected error while deleting user',
            );
          });
        if (!deletedUser) {
          throw new NotFoundException('User to delete not found');
        }
        return 'User Deleted Successfully';
      } else
        throw new UnauthorizedException(
          'You dont have the permission to delete this user',
        );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An unexpected error happened while deleting the user',
      );
    }
  }

  async getUsersPerMonth(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user || user.role != 'admin') {
      throw new NotFoundException('There is no admin user with this id');
    }

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
    ]);

    // Prepare the result array with counts for the last 12 months
    const mappedData = result.map(({ _id: { month, year }, count }) => ({
      month: `${year}-${month < 10 ? '0' + month : month}`,
      count,
    }));

    return mappedData;
  }

  async getShopsPerMonth(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user || user.role != 'admin') {
      throw new NotFoundException('There is no admin user with this id');
    }

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

    // Prepare the result array with counts for the last 12 months
    const mappedData = result.map(({ _id: { month, year }, count }) => ({
      month: `${year}-${month < 10 ? '0' + month : month}`,
      count,
    }));

    return mappedData;
  }
}
