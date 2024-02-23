import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user_schema';
import * as bcrypt from 'bcrypt';
import { ShopService } from 'src/user/shop.service';
import { Order, OrderDocument, OrderStatusTypes } from 'src/order/schemas/order_schema';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { Item, ItemDocument } from 'src/item/schemas/item-schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly shopService: ShopService,
    private readonly jwtService: JwtService,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>
  ) { }
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
          path: 'cart',
          model: 'Item',
        }).populate({
          path: 'wishList',
          model: 'Item',
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
      const { currentId, updateId, cart, orders, wishList } = updateUserDto;
      const user = await this.userModel.findById(currentId).catch((err) => {
        console.log(err);
        throw new NotFoundException('This user doesn\'t exist');
      });

      if (updateId === currentId || user.role === 'admin') {
        let updatedUser;

        if (cart && cart.length > 0) {
          const itemToAdd = cart[0];
          const existingItemIndex = user.cart.findIndex((itemId) => itemId === itemToAdd);
          if (existingItemIndex !== -1) {
            user.cart.splice(existingItemIndex, 1);
            updateUserDto.cart = undefined
          } else {
            user.cart.push(itemToAdd);
            updateUserDto.cart = undefined
          }
        }
        if (wishList && wishList.length > 0) {
          const itemToAddToWishList = wishList[0];
          const existingItemIndexWish = user.wishList.findIndex((itemId) => itemId === itemToAddToWishList);
          if (existingItemIndexWish !== -1) {
            user.wishList.splice(existingItemIndexWish, 1);
            updateUserDto.wishList = undefined
          } else {
            user.wishList.push(itemToAddToWishList);
            updateUserDto.wishList = undefined
          }
        }
        await user.save()


        if (orders) {
          const updatedOrders = [...user.orders, ...orders];
          updateUserDto.orders = updatedOrders;
        }

        updatedUser = await this.userModel
          .findByIdAndUpdate(updateId, updateUserDto, { new: true }).populate({ path: 'cart', model: 'Item' })
          .catch((err) => {
            console.log(err);
            throw new InternalServerErrorException(
              err
            );
          });

        updatedUser.password = undefined;
        return updatedUser;
      } else {
        throw new UnauthorizedException('Unauthorized error');
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }



  async checkOut(id: string) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const itemsInCart = await this.itemModel.find({ _id: { $in: user.cart } }).exec();
      const shop = await this.shopService.findOne(itemsInCart[0].shopID).catch(err => {
        console.log(err);
        throw new InternalServerErrorException('Failed to find shop');
      });
      let totalPrice = 0;
      itemsInCart.forEach(item => {
        totalPrice += item.price;
      });

      const orderDto: CreateOrderDto = {
        buyerId: id,
        sellerId: shop.userID,
        items: itemsInCart.map(item => ({ itemID: item._id.toString(), price: item.price })) as Types.Array<{ itemID: string; price: number; }>,
        deliveryType: false,
        paid: false,
        status: OrderStatusTypes.INPROGRESS,
        comments: 'Sample comment',
        shopId: itemsInCart[0].shopID,
        priceTotal: totalPrice
      };


      const createdOrder = await this.orderModel.create(orderDto);


      user.orders.push(createdOrder._id);
      user.cart = [];
      await user.save();

      return "Order created successfully!";
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create order');
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
        for (const shopId of user.shops) {
          await this.shopService.remove(shopId);
        }

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
