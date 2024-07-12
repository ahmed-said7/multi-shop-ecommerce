import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserRole } from './schemas/user_schema';
import * as bcrypt from 'bcrypt';

import { Order, OrderDocument } from '../order/schemas/order_schema';
import { ApiService, IQuery } from 'src/common/filter/api.service';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private apiService:ApiService<User,IQuery>,
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
      const token = this.generateToken(savedUser);
      const userResponse = { ... savedUser.toObject() , password: undefined };
      return { token , user: userResponse };
  }

  async findAll(userId:string , page?: string ) {
    const user=await this.userModel.findOne({
      _id:userId,role:UserRole.ADMIN
    });
    if( ! user ){
      throw new HttpException("you are not allowed to access this route",400);
    }
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
    return { foundUser };
  }

  async findOneWithEmail(email: string) {
    const foundUser= await this.userModel.findOne({ email });
    if (!foundUser) throw new NotFoundException('This user doesnt exist');
    return { foundUser };
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
      // const user = await this.userModel.findById(userId);
      // if (cart && cart.length > 0) {
      //   const itemToAdd = cart[0];
      //   const existingItemIndex = user.cart.findIndex(
      //     (itemId) => itemId === itemToAdd,
      //   );
      //   if (existingItemIndex !== -1) {
      //     user.cart.splice(existingItemIndex, 1);
      //     updateUserDto.cart = undefined;
      //   } else {
      //     user.cart.push(itemToAdd);
      //     updateUserDto.cart = undefined;
      //   }
      // }

      // if (wishList && wishList.length > 0) {
      //   const itemToAddToWishList = wishList[0];
      //   const existingItemIndexWish = user.wishList.findIndex(
      //     (itemId) => new Types.ObjectId(itemId) === itemToAddToWishList,
      //   );
      //   if (existingItemIndexWish !== -1) {
      //     user.wishList.splice(existingItemIndexWish, 1);
      //     updateUserDto.wishList = undefined;
      //   } else {
      //     user.wishList.push(itemToAddToWishList);
      //     updateUserDto.wishList = undefined;
      //   }
      // }
      // await user.save();

      // if (orders) {
      //   const updatedOrders = [...user.orders, ...orders];
      //   updateUserDto.orders = updatedOrders;
      // }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(userId, updateUserDto, { new: true })
        .populate({ path: 'cart', model: 'Item' });

      updatedUser.password = undefined;

      return { updatedUser };
  }

  async remove( userId: string) {
    // only and UserRole.USER 
    const targetUser = await this.userModel.findById(userId);

    // if (!targetUser) {
    //   throw new NotFoundException('This user doesnt exist');
    // }

    await this.orderModel.deleteMany({ userId });

    await this.userModel.findByIdAndDelete(userId);

    return { status : 'User Deleted Successfully'};
  }

  private generateToken( user: UserDocument ): string {
    const payload = { userId: user._id, email: user.email };
    return this.jwtService.sign(payload, { secret: process.env.SECRET });
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