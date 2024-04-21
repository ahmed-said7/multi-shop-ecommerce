import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/user/schemas/user_schema';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { ShopService } from './shop.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly shopService: ShopService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { email } = createUserDto;
      const foundUser = await this.userModel.findOne({ email });
      if (foundUser) {
        throw new UnauthorizedException('There is a user with the same email!');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const createdUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });

      const savedUser = await createdUser.save().catch((err) => {
        console.log(err);
        if (err && err.code == 11000) {
          console.log(err);

          throw new BadRequestException(
            'There is a user with the same phone number!',
          );
        } else
          throw new InternalServerErrorException(
            'Unexpected error while creating the user',
          );
      });

      const token = this.generateToken(savedUser);
      const userResponse = { ...savedUser.toObject(), password: undefined };

      return { token, user: userResponse };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(page?: number) {
    try {
      const foundUsers = await this.userModel
        .find()
        .limit(10)
        .skip(page * 10);

      const count = await this.userModel.find().countDocuments();
      foundUsers.forEach((user) => {
        user.password = undefined;
      });
      return { count, foundUsers };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
      const idValid = checkForHexRegExp.test(id);
      if (!idValid) throw new BadRequestException('Please enter correct Id');
      const foundUser = await this.userModel
        .findById(id)
        .populate({
          path: 'cart.orderId',
          model: 'Order',
        })
        .exec()
        .catch((err) => {
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
      throw new InternalServerErrorException(error);
    }
  }

  async findOneWithEmail(email: string) {
    return await this.userModel
      .findOne({ email })
      .lean()
      .exec()
      .catch((err) => {
        console.log(err);
        throw new NotFoundException('This user doesnt exist');
      });
  }
  async update(updateUserDto: UpdateUserDto) {
    try {
      const { currentId, updateId, ...data } = updateUserDto;
      const user = await this.userModel.findById(currentId).catch((err) => {
        console.log(err);
        throw new NotFoundException('This user doesnt exist');
      });

      if (updateId === currentId || user.role == 'admin') {
        const updatedUser = await this.userModel
          .findByIdAndUpdate(updateId, data, { new: true })
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
      throw new InternalServerErrorException(error);
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
        await this.shopService.remove(user.shop);

        const deletedUser = await this.userModel
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
      throw new InternalServerErrorException(error);
    }
  }

  private generateToken(user: UserDocument): string {
    const payload = { sub: user._id, email: user.email };
    return this.jwtService.sign(payload, { secret: process.env.SECRET });
  }
}
