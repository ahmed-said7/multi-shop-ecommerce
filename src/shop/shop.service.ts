import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
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
import { Merchant, MerchantDocument } from 'src/merchant/schema/merchant.schema';

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
    private apiService:ApiService<ShopDocument,QueryShopDto>,
    @InjectModel(Merchant.name)
    private readonly merchantModel: mongoose.Model<MerchantDocument>
    // private readonly uploadService: UploadService,
  ) {};
  async create(body: CreateShopDto, user: IAuthUser) {
      let shop;
      if( user.shopId ){
        shop=await this.shopModel.findById(user.shopId);
      };
      if( shop ){
        throw new BadRequestException('You already have a shop');
      }
      shop = await this.shopModel.create({
        ... body,userID:user._id
      });
      return {shop};
  }

  async findAll(query: QueryShopDto) {
    const { paginationObj,query:result }=await this.apiService.
      getAllDocs( this.shopModel.find(), query , ["title", "description"]);
    const shops=await result;
    return { shops, paginationObj };
  };

  async findOne(id: string){
    const foundShop = await this.shopModel
      .findById(id)
      .populate({path:'itemsIDs',select:'name'})
      .populate({
        path: 'customers',
        model: 'User',
        select: 'name email',
      }).populate({
        path: 'categories',
        model: 'Category',
        select: 'name',
      });
      if (!foundShop)
        throw new NotFoundException('There is no shop with this id');

      return {foundShop};
  }

  async findUserShops(userId: string) {
      const shops = await this.shopModel.find({
        userID: userId
      });
      if(shops.length==0){
        throw new NotFoundException("shops not found");
      };
      return {shops};
  };

  async update(
    id: string,
    file: Express.Multer.File,
    body: UpdateShopDto,
  ) {
      const shop = await this.shopModel.findByIdAndUpdate(id, body, {
        new: true,
      });
      if(!shop){
        throw new HttpException("Shop not found",400);
      }
      return {shop};
  }

  async userJoin(shopId: mongoose.Types.ObjectId, userId: string) {
      const user = await this.userModel.findById(userId);

      if (!user) throw new NotFoundException("This user doesn't exist");

      const shop = await this.shopModel.findByIdAndUpdate(shopId, {
        $addToSet: { customers: user._id },
      });

      if (!shop) throw new NotFoundException('There is no shop with this id');

      return {status:'User added successfully!'};
  };

  async addUser(
    shopId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
  ) {
      const shop = await this.shopModel.findByIdAndUpdate(shopId, {
        $addToSet: { customers: userId },
      });
      if (!shop) throw new NotFoundException('There is no shop with this id');
      return {status:'User added successfully!'};
  }
  async findShopItems( id: string) {
      const shop = await this.shopModel
        .findById(id)
        .populate('itemsIDs');
      if( ! shop  ){
        throw new HttpException("Shop not found",400);
      };
      const items = shop.itemsIDs;
      return {items};
  }

  async remove(user: IAuthUser , shopId: string) {
      const shop = await this.shopModel.findById(shopId);
      if (!shop) {
        throw new NotFoundException('Shop not found');
      };
      if ( 
        shop.userID.toString() != user._id.toString() && 
        user.role !== AllRoles.ADMIN
      ) {
        throw new UnauthorizedException(
          'You dont have the permission to delete this shop',
        );
      };
      const ids=shop.containers.map( ({containerID}) => containerID );
      const promises=[
        this.itemModel.deleteMany({ _id: { $in: shop.itemsIDs }  }),
        this.categoryModel.deleteMany({ _id: { $in: shop.categories }  }),
        this.productSliderModel.deleteMany({ _id : { $in : ids } , shopId }),
        this.photoSliderModel.deleteMany({ _id : { $in : ids } , shopId }),
        this.reviewContainerModel.deleteMany({ _id : { $in : ids } , shopId }),
        this.videoContainerModel.deleteMany({ _id : { $in : ids } , shopId }),
        this.bannerModel.deleteMany({ _id : { $in : ids } , shopId })
      ];
      await Promise.all(promises);
      await this.shopModel.findByIdAndDelete(user.shopId);
      const merchant=await this.merchantModel.findById(shop.userID);
      const newShop = await this.shopModel.create({
        title: `${merchant.name}-Shop`,userID:user._id
      });
      await this.merchantModel.findByIdAndUpdate(shop.userID,{shopId:newShop._id});
      return {status:'Shop was deleted successfully'};
  }

  async findShopContainers(id: string) {
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
        });
      return { containers: shop.containers };
  }
}
