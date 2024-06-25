import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as mongoose from 'mongoose';

import { Shop, ShopDocument } from './schemas/shop_schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateShopDto } from './dto/update-shop.dto';
import { CreateShopDto } from './dto/create-shop.dto';
import {
  ProductSlider,
  ProductSliderDocument,
} from '../product-slider/schemas/productSlider_schema';
import {
  PhotoSlider,
  PhotoSliderDocument,
} from '../photo-slider/schemas/photo-slider_schema';
import {
  Category,
  CategoryDocument,
} from '../category/schemas/category_schema';
import { Item, ItemDocument } from '../item/schemas/item-schema';
import { User, UserDocument, UserRole } from '../user/schemas/user_schema';
import {
  ReviewContainer,
  ReviewContainerDocument,
} from '../review-container/schemas/reviewContainer_schema';
import {
  VideoContainer,
  VideoContainerDocument,
} from '../video-container/schemas/videoContainer-schema';
import { Banner, BannerDocument } from '../banner/schemas/banner_schema';
import { UploadService } from 'src/upload/upload.service';

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
    @InjectModel(Banner.name)
    private readonly bannerModel: mongoose.Model<BannerDocument>,
    private readonly uploadService: UploadService,
  ) {}

  private readonly logger = new Logger(ShopService.name);

  async create(createShopDto: CreateShopDto, userId: string) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) throw new NotFoundException('There is no user with this id');
      if (user.shopId) throw new BadRequestException('You already have a shop');

      createShopDto.userID = user.id;

      const shop = await this.shopModel.create(createShopDto);

      await this.userModel.findByIdAndUpdate(user.id, {
        role: UserRole.MERCHANT,
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
      const shops = await this.shopModel.find({
        userID: userId,
      });

      return shops;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: string,
    file: Express.Multer.File,
    updateShopDto: UpdateShopDto,
  ) {
    if (!id) {
      throw new BadRequestException("Can't find shop");
    }

    try {
      const url = await this.uploadService.uploadFile(file);

      updateShopDto.logo = url;

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

      if (!shopId && user.role == UserRole.MERCHANT) {
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
          case 'ProductSlider':
            await this.productSliderModel.findByIdAndDelete(
              container.containerID,
            );
            break;
          case 'PhotoSlider':
            await this.photoSliderModel.findByIdAndDelete(
              container.containerID,
            );
            break;
          case 'ReviewContainer':
            await this.reviewContainerModel.findByIdAndDelete(
              container.containerID,
            );
            break;

          case 'VideoContainer':
            await this.videoContainerModel.findByIdAndDelete(
              container.containerID,
            );
            break;
          case 'Banner':
            await this.bannerModel.findByIdAndDelete(container.containerID);
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
      const shop = await this.shopModel
        .findById(id)
        .populate({
          path: 'containers.containerID',
          populate: [
            {
              path: 'products',
              model: 'Item',
              options: { strictPopulate: false },
            },
            {
              path: 'reviews',
              model: 'Review',
              options: { strictPopulate: false },
            },
          ],
        })
        .exec();
      if (!shop) {
        throw new NotFoundException('shop not found');
      }

      return { containers: shop.containers };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
