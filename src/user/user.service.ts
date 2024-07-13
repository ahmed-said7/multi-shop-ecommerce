import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user_schema';
import * as bcrypt from 'bcrypt';

import { Order, OrderDocument } from '../order/schemas/order_schema';
import { ApiService, IQuery } from 'src/common/filter/api.service';
import { jwtTokenService } from 'src/jwt/jwt.service';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private apiService:ApiService<User,IQuery>,
    private jwt:jwtTokenService,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async register(createUserDto: CreateUserDto) {
      const { email, phone } = createUserDto;
      const foundUser = await this.userModel.findOne({ 
        $or:[{ email } , { phone } ]
      });
      if (foundUser) {
        throw new BadRequestException('There is a user with the same email or phone!');
      }
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      const savedUser=await this.userModel.create(createUserDto);
      const { accessToken , refreshToken } = this.jwt.createTokens({
        userId: savedUser._id.toString(),
        role:savedUser.role
      });
      return { accessToken ,  refreshToken , user:savedUser.toObject() };
  }

  async findAll( page?: string ) {
    const { paginationObj , query }=await this.apiService
      .getAllDocs( this.userModel.find(),{ page } );
    const users=await query;
    return { paginationObj , users };
  }

  async findOne(id: string) {
    const foundUser = await this.userModel
      .findById(id)
      .populate({
        path: 'cart',
        model: 'Item',
      })
      .populate({
        path: 'wishList',
        model: 'Item',
      }).select("-password");
    if (!foundUser) throw new NotFoundException('This user doesnt exist');
    return { user:foundUser };
  }

  async findOneWithEmail( email: string ) {
    const foundUser= await this.userModel.findOne({ email });
    if (!foundUser) throw new NotFoundException('This user doesnt exist');
    return { foundUser };
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(userId, updateUserDto, { new: true })
        .select("-password")
        .populate({ path: 'cart', model: 'Item' });
      return { updatedUser };
  }

  async remove( userId: string) {
    await this.orderModel.deleteMany({ userId });

    await this.userModel.findByIdAndDelete(userId);

    return { status : 'User Deleted Successfully'};
  }

  async addFav(itemId: string, userId: string ) {
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            favorites: itemId,
          },
        },
        { new: true },
      );
      return { favorites : user?.favorites || [] };
  }
  async removeFav(itemId: string, userId: string ) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          favorites: itemId,
        },
      },
      { new: true },
    );
    return { favorites : user?.favorites || [] };
  }
}