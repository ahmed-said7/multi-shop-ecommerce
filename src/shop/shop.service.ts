import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as mongoose from 'mongoose';

import { Shop, ShopDocument } from './schemas/shop_schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateShopDto } from './dto/update-shop.dto';
import { CreateShopDto } from './dto/create-shop.dto';
import {
  ProductSlider,
  ProductSliderDocument,
} from 'src/product-slider/schemas/productSlider_schema';
import {
  PhotoSlider,
  PhotoSliderDocument,
} from 'src/photo-slider/schemas/photo-slider_schema';
import {
  Category,
  CategoryDocument,
} from 'src/category/schemas/category_schema';
import { Item, ItemDocument } from 'src/item/schemas/item-schema';
import { User, UserDocument, UserRole } from 'src/user/schemas/user_schema';
import {
  ReviewContainer,
  ReviewContainerDocument,
} from 'src/review-container/schemas/reviewContainer_schema';
import {
  VideoContainer,
  VideoContainerDocument,
} from 'src/video-container/schemas/videoContainer-schema';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(Shop.name)
    private readonly shopModel: mongoose.Model<ShopDocument>,
    @InjectModel(Item.name)
    private readonly itemModel: mongoose.Model<ItemDocument>,
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<UserDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: mongoose.Model<CategoryDocument>,
    @InjectModel(ProductSlider.name)
    private readonly productSliderModel: mongoose.Model<ProductSliderDocument>,
    @InjectModel(PhotoSlider.name)
    private readonly photoSliderModel: mongoose.Model<PhotoSliderDocument>,
    @InjectModel(ReviewContainer.name)
    private reviewContainerModel: mongoose.Model<ReviewContainerDocument>,
    @InjectModel(VideoContainer.name)
    private readonly videoContainerModel: mongoose.Model<VideoContainerDocument>,
    private readonly jwtService: JwtService,
  ) {}

  private decodeToken(token: string) {
    return this.jwtService.decode<{ sub: string; email: string }>(token);
  }

  async create(createShopDto: CreateShopDto, userId: string) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) throw new NotFoundException('There is no user with this id');
      if (user.shopId) throw new BadRequestException('You already have a shop');

      createShopDto.userID = user.id;

      const shop = await this.shopModel.create(createShopDto);

      await this.userModel.findByIdAndUpdate(user.id, {
        role: UserRole.SHOP_OWNER,
        shop: shop.id,
      });

      return shop;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(userId: string) {
    const user = await this.userModel.findById(userId);

    if (user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException(
        `The user ${userId} is not authrized to view all shops`,
      );
    }

    try {
      const shops = await this.shopModel.find();

      const count = await this.shopModel.find().countDocuments();

      return { count, shops };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<Shop> {
    try {
      const idValid = mongoose.isValidObjectId(id);
      if (!idValid) throw new BadRequestException('Please enter correct Id');

      const foundShop = await this.shopModel
        .findById(id)
        .populate('itemsIDs', 'name')
        .populate({
          path: 'customers',
          model: 'User',
          select: 'name email',
        })
        .populate({
          path: 'categories',
          model: 'Category',
          select: 'name subCategory',
        })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });

      if (!foundShop)
        throw new NotFoundException('There is no shop with this id');

      return foundShop;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findUserShops(userId: string) {
    try {
      const shops = await this.shopModel
        .find({
          userID: userId,
        })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });

      return shops;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateShopDto: UpdateShopDto) {
    try {
      const shop = await this.shopModel.findByIdAndUpdate(id, updateShopDto, {
        new: true,
      });

      return shop;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async userJoin(shopId: mongoose.Types.ObjectId, userId: string) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) throw new NotFoundException("This user doesn't exist");

      const shop = await this.shopModel.findByIdAndUpdate(shopId, {
        $addToSet: { customers: user.id },
      });

      if (!shop) throw new NotFoundException('There is no shop with this id');

      return 'User added successfully!';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async addUser(
    shopId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
  ) {
    try {
      const shop = await this.shopModel.findByIdAndUpdate(shopId, {
        $push: { customers: userId },
      });

      if (!shop) throw new NotFoundException('There is no shop with this id');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
  async findShopItems(userId: string, id?: string) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException('There is no user with this id');
      }

      let shopId = new mongoose.Types.ObjectId(id);

      if (!shopId && user.role == UserRole.SHOP_OWNER) {
        shopId = user.shopId;
      }

      const shop = await this.shopModel
        .findById(shopId)
        .populate('itemsIDs')
        .exec();

      const items = shop.itemsIDs;
      return items;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(userId: string, shopId: string) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException('There is no user with this id');
      }

      const shop = await this.shopModel.findById(shopId);

      if (!shop) {
        throw new NotFoundException('Shop not found');
      }

      if (shop.userID != user.id && user.role !== UserRole.ADMIN) {
        throw new UnauthorizedException(
          'You dont have the permission to delete this shop',
        );
      }

      await this.itemModel.deleteMany({ _id: { $in: shop.itemsIDs } });

      await this.categoryModel.deleteMany({ _id: { $in: shop.categories } });

      for (const container of shop.containers) {
        switch (container.containerType) {
          case 'product slider':
            await this.productSliderModel.findByIdAndDelete(
              container.containerID,
            );
            break;
          case 'photo slider':
            await this.photoSliderModel.findByIdAndDelete(
              container.containerID,
            );
            break;
          case 'review container':
            await this.reviewContainerModel.findByIdAndDelete(
              container.containerID,
            );
            break;

          case 'video container':
            await this.videoContainerModel.findByIdAndDelete(
              container.containerID,
            );
            break;
        }
      }

      await this.shopModel.findByIdAndDelete(user.shopId);

      return 'Shop was deleted successfully';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findShopContainers(id: string): Promise<any> {
    try {
      const shop = await this.shopModel.findById(id);

      const containers = [];

      for (const container of shop.containers) {
        switch (container.containerType) {
          case 'review container':
            const reviewContainer = await this.reviewContainerModel.findById(
              container.containerID,
            );
            if (reviewContainer) {
              await reviewContainer.populate({
                path: 'review',
                model: 'Review',
              });
              containers.push({
                type: 'review container',
                container: reviewContainer,
              });
            }
            break;
          case 'product slider':
            const productSlider = await this.productSliderModel.findById(
              container.containerID,
            );
            if (productSlider) {
              await productSlider.populate({ path: 'products', model: 'Item' });
              containers.push({
                type: 'product slider',
                container: productSlider,
              });
            }
            break;
          case 'photo slider':
            const photoSlider = await this.photoSliderModel.findById(
              container.containerID,
            );
            if (photoSlider) {
              containers.push({ type: 'photo slider', container: photoSlider });
            }
            break;
          case 'video container':
            const videoContainer = await this.videoContainerModel
              .findById(container.containerID)
              .catch((err) => {
                console.log(err);
                throw new InternalServerErrorException(err);
              });
            containers.push({
              type: 'video container',
              container: videoContainer,
            });
            break;
        }
      }

      return containers;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
