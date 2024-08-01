import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { v4 } from 'uuid';
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
import { User, UserDocument } from '../user/schemas/user_schema';
import {
  ReviewContainer,
  ReviewContainerDocument,
} from '../review-container/schemas/reviewContainer_schema';

import {
  VideoContainer,
  VideoContainerDocument,
} from '../video-container/schemas/videoContainer-schema';

import { Banner, BannerDocument } from '../banner/schemas/banner_schema';
import { AllRoles, IAuthUser } from 'src/common/enums';
import { ApiService } from 'src/common/filter/api.service';
import { QueryShopDto } from './dto/query-shop.dto';
import {
  Merchant,
  MerchantDocument,
} from 'src/merchant/schema/merchant.schema';
import { CustomI18nService } from 'src/common/custom-i18n.service';

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
    private apiService: ApiService<ShopDocument, QueryShopDto>,
    @InjectModel(Merchant.name)
    private readonly merchantModel: mongoose.Model<MerchantDocument>,
    private i18n: CustomI18nService,
    // private readonly uploadService: UploadService,
  ) {}
  async create(body: CreateShopDto, user: IAuthUser) {
    let shop;
    if (user.shopId) {
      shop = await this.shopModel.findById(user.shopId);
    }
    if (shop) {
      throw new BadRequestException(this.i18n.translate('test.shop.duplicate'));
    }
    shop = await this.shopModel.create({
      ...body,
      userID: user._id,
    });
    return { shop };
  }

  async findAll(query: QueryShopDto) {
    const { paginationObj, query: result } = await this.apiService.getAllDocs(
      this.shopModel.find(),
      query,
      ['title', 'description'],
    );
    const shops = await result;
    if (shops.length == 0) {
      throw new NotFoundException(this.i18n.translate('test.shop.notFound'));
    }
    return { shops, paginationObj };
  }

  async findOne(id: string) {
    const foundShop = await this.shopModel
      .findById(id)
      .populate({ path: 'itemsIDs', select: 'name' })
      .populate({
        path: 'customers',
        model: 'User',
        select: 'name email',
      })
      .populate({
        path: 'categories',
        model: 'Category',
        select: 'name',
      });
    if (!foundShop)
      throw new NotFoundException(this.i18n.translate('test.shop.notFound'));

    return { foundShop };
  }

  async findUserShops(userId: string) {
    const shops = await this.shopModel.find({
      userID: userId,
    });
    if (shops.length == 0) {
      throw new NotFoundException(this.i18n.translate('test.shop.notFound'));
    }
    return { shops };
  }

  async update(id: string, file: Express.Multer.File, body: UpdateShopDto) {
    const shop = await this.shopModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!shop) {
      throw new HttpException(this.i18n.translate('test.shop.notFound'), 400);
    }
    return { shop };
  }

  async userJoin(shopId: mongoose.Types.ObjectId, userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user)
      throw new NotFoundException(this.i18n.translate('test.user.notFound'));

    const shop = await this.shopModel.findByIdAndUpdate(shopId, {
      $addToSet: { customers: user._id },
    });

    if (!shop)
      throw new NotFoundException(this.i18n.translate('test.shop.notFound'));

    return { status: this.i18n.translate('test.shop.added') };
  }

  async addUser(shopId: string, userId: string) {
    const shop = await this.shopModel.findByIdAndUpdate(shopId, {
      $addToSet: { customers: userId },
    });
    if (!shop)
      throw new NotFoundException(this.i18n.translate('test.shop.notFound'));
    return { status: this.i18n.translate('test.shop.added') };
  }
  async findShopItems(id: string) {
    const shop = await this.shopModel.findById(id).populate('itemsIDs');
    if (!shop) {
      throw new HttpException(this.i18n.translate('test.shop.notFound'), 400);
    }
    const items = shop.itemsIDs;
    return { items };
  }

  async remove(user: IAuthUser, shopId: string) {
    const shop = await this.shopModel.findById(shopId);
    if (!shop) {
      throw new NotFoundException(this.i18n.translate('test.shop.notFound'));
    }
    if (
      shop.userID.toString() != user._id.toString() &&
      user.role !== AllRoles.ADMIN
    ) {
      throw new UnauthorizedException(
        this.i18n.translate('test.shop.credentials'),
      );
    }
    const ids = shop.containers.map(({ containerID }) => containerID);
    const promises = [
      this.itemModel.deleteMany({ _id: { $in: shop.itemsIDs } }),
      this.categoryModel.deleteMany({ _id: { $in: shop.categories } }),
      this.productSliderModel.deleteMany({ _id: { $in: ids }, shopId }),
      this.photoSliderModel.deleteMany({ _id: { $in: ids }, shopId }),
      this.reviewContainerModel.deleteMany({ _id: { $in: ids }, shopId }),
      this.videoContainerModel.deleteMany({ _id: { $in: ids }, shopId }),
      this.bannerModel.deleteMany({ _id: { $in: ids }, shopId }),
    ];
    await Promise.all(promises);
    await this.shopModel.findByIdAndDelete(shopId);
    const merchant = await this.merchantModel.findById(shop.userID);
    if (!merchant) {
      return { status: this.i18n.translate('test.shop.deleted') };
    }
    const newShop = await this.shopModel.create({
      title: `${v4()}-Shop`,
      userID: merchant._id.toString(),
    });
    await this.merchantModel.findByIdAndUpdate(shop.userID, {
      shopId: newShop._id.toString(),
    });
    return { status: this.i18n.translate('test.shop.deleted') };
  }

  async findShopContainers(id: string) {
    const shop = await this.shopModel.findById(id).populate({
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
    });
    return { containers: shop.containers };
  }
}
