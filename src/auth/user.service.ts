import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { ShopService } from './shop.service';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { User, UserDocument, UserRole } from '../user/schemas/user_schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly shopService: ShopService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
      const { email } = createUserDto;
      const foundUser = await this.userModel.findOne({ email });
      if (foundUser) {
        throw new UnauthorizedException('There is a user with the same email!');
      };
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      const savedUser=await this.userModel.create(createUserDto);
      const token = this.generateToken(savedUser);
      const userResponse = { ... savedUser.toObject() , password: undefined };
      return { token , user: userResponse };
    }

  async findAll( page?: number ) {
    page ||= 1;
    const foundUsers = await this.userModel
        .find()
        .select("-password")
        .limit(10)
        .skip(page * 10);
      const count = await this.userModel.find().countDocuments();
      return { count, foundUsers };
  };

  async findOne(id: string) {
      const foundUser = await this.userModel
        .findById(id)
        .populate({
          path: 'cart.orderId',
          model: 'Order'
        }).select("-password");
      if (!foundUser) throw new NotFoundException('This user doesnt exist');
      return { foundUser };
  }

  async findOneWithEmail(email: string) {
    const foundUser= await this.userModel.findOne({ email }).select("-password");
    if (!foundUser) throw new NotFoundException('This user doesnt exist');
    return { foundUser };
  }
  async update( id: Types.ObjectId , updateUserDto: UpdateUserDto ) {
    // id of logged user
    const updatedUser = await this.userModel
      .findById(id , updateUserDto , { new: true }).select("-password");
    return { updatedUser };
  }

  async remove(userId: Types.ObjectId ) {
    // id of logged user
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) throw new NotFoundException('This user doesnt exist')
    return { status : 'User Deleted Successfully'};
  }

  private generateToken(user: UserDocument): string {
    const payload = { userId: user._id, email: user.email };
    return this.jwtService.sign(payload, { secret: process.env.SECRET });
  }

}
