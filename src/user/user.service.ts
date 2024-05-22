import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import mongoose, { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserRole } from './schemas/user_schema';
import * as bcrypt from 'bcrypt';
import { ShopService } from 'src/user/shop.service';
import {
  Order,
  OrderDocument,
  OrderStatusTypes,
} from 'src/order/schemas/order_schema';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { Item, ItemDocument } from 'src/item/schemas/item-schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly shopService: ShopService,
    private readonly jwtService: JwtService,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { email } = createUserDto;
      const foundUser = await this.userModel.findOne({ email });

      if (foundUser) {
        throw new BadRequestException('There is a user with the same email!');
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

      const userResponse = { ...savedUser.toObject(), password: undefined };

      const token = this.generateToken(savedUser);

      // Creating a shop on regsiter, CR.
      const shop = await this.shopService.create({
        categories: [],
        containers: [],
        customers: [],
        description: 'Add Description',
        title: `${userResponse.email.split('@')[0]} shop`,
        userID: userResponse._id,
      });

      // Save shopID in user document
      const updatedUser = await this.userModel.findByIdAndUpdate(
        savedUser._id,
        {
          shop: shop._id,
        },
        { new: true },
      );

      return { token, user: updatedUser, shop };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async registerShop(registerData: any) {
    try {
      const createUserDto = registerData.user;
      const createShopDto = registerData.shop;
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

      const shop = await this.shopService.create(createShopDto);

      const userResponse = { ...savedUser.toObject(), password: undefined };

      const token = this.generateToken(savedUser);

      return { token, user: userResponse, shop };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(userId: string, page?: number) {
    const user = await this.userModel.findById(userId);

    if (user.role.toLowerCase() !== 'admin') {
      throw new UnauthorizedException('User Must Be an Admin');
    }

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
        })
        .populate({
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
    return await this.userModel.findOne({ email }).lean().exec();
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    try {
      const { cart, orders, wishList } = updateUserDto;

      // Can't update role
      delete updateUserDto.role;

      const user = await this.userModel.findById(userId);

      if (cart && cart.length > 0) {
        const itemToAdd = cart[0];
        const existingItemIndex = user.cart.findIndex(
          (itemId) => itemId === itemToAdd,
        );
        if (existingItemIndex !== -1) {
          user.cart.splice(existingItemIndex, 1);
          updateUserDto.cart = undefined;
        } else {
          user.cart.push(itemToAdd);
          updateUserDto.cart = undefined;
        }
      }

      if (wishList && wishList.length > 0) {
        const itemToAddToWishList = wishList[0];
        const existingItemIndexWish = user.wishList.findIndex(
          (itemId) => new Types.ObjectId(itemId) === itemToAddToWishList,
        );
        if (existingItemIndexWish !== -1) {
          user.wishList.splice(existingItemIndexWish, 1);
          updateUserDto.wishList = undefined;
        } else {
          user.wishList.push(itemToAddToWishList);
          updateUserDto.wishList = undefined;
        }
      }
      await user.save();

      if (orders) {
        const updatedOrders = [...user.orders, ...orders];
        updateUserDto.orders = updatedOrders;
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(userId, updateUserDto, { new: true })
        .populate({ path: 'cart', model: 'Item' });

      updatedUser.password = undefined;

      return updatedUser;
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

      const itemsInCart = await this.itemModel
        .find({ _id: { $in: user.cart } })
        .exec();
      const shop = await this.shopService
        .findOne(itemsInCart[0].shopId.toString())
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException('Failed to find shop');
        });
      let totalPrice = 0;
      itemsInCart.forEach((item) => {
        totalPrice += item.price;
      });

      const orderDto: CreateOrderDto = {
        buyerId: id,
        sellerId: new Types.ObjectId(shop.userID),
        items: user.cart,
        deliveryType: false,
        paid: false,
        status: OrderStatusTypes.INPROGRESS,
        comments: 'Sample comment',
        shopId: itemsInCart[0].shopId,
        priceTotal: totalPrice,
      };

      const createdOrder = await this.orderModel.create(orderDto);

      user.orders.push(createdOrder._id);
      user.cart = [];
      await user.save();

      return 'Order created successfully!';
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  async remove(paramId: string, userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('This user doesnt exist');
    }

    const targetUser = await this.userModel.findById(paramId);

    if (!targetUser) {
      throw new NotFoundException('This user doesnt exist');
    }

    if (user.role === UserRole.SHOP_OWNER) {
      throw new UnauthorizedException(
        'You dont have the permission to delete this user',
      );
    }

    if (user.role === UserRole.USER && paramId !== userId) {
      throw new UnauthorizedException(
        'You dont have the permission to delete this user',
      );
    }

    for (const orderId of user.orders) {
      await this.orderModel.findByIdAndDelete(orderId);
    }

    // Remove The User Shop.
    await this.shopService.remove(targetUser.shopId.toString());

    const deletedUser = await this.userModel.findByIdAndDelete(paramId);

    if (!deletedUser) {
      throw new NotFoundException('User to delete not found');
    }

    return 'User Deleted Successfully';
  }

  private generateToken(user: UserDocument): string {
    const payload = { sub: user._id, email: user.email };
    return this.jwtService.sign(payload, { secret: process.env.SECRET });
  }

  async addFav(itemId: string, userId: string) {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            favorites: itemId,
          },
        },
        { new: true },
      );

      return user?.favorites || [];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
  async addToCart(itemId: mongoose.Types.ObjectId, userId: string) {
    try {
      const user = await this.userModel.findById(userId);

      user.cart.push(itemId);

      await user.save();

      return 'Item added successfully';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async removeItemCart(itemId: mongoose.Types.ObjectId, userId: string) {
    try {
      const user = await this.userModel.findById(userId);

      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i] == itemId) {
          user.cart.splice(i, 1);
          break;
        }
      }

      await user.save();

      return 'Item removed successfully';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
  private decodeToken(token: string) {
    return this.jwtService.decode<{ userId: string; username: string }>(token);
  }
}
