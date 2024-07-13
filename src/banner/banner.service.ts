import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Banner, BannerDocument } from './schemas/banner_schema';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { QueryBannerDto } from './dto/query-banner.dto';
import { ApiService } from 'src/common/filter/api.service';
import { IAuthUser } from 'src/common/enums';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name)
    private readonly bannerModel: Model<BannerDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    private apiService:ApiService<BannerDocument,QueryBannerDto>
  ) {};

  async create(
    shopId: string,
    createBannerDto: CreateBannerDto,
  ) {
    const payload = {
      ...createBannerDto,
      shopId,
    };

    const createdBanner = await this.bannerModel.create(payload);

    const Shop = await this.shopModel.findById(shopId);

    if (!Shop) {
      throw new NotFoundException("Couldn't find the shop");
    };
    
    await this.shopModel.findByIdAndUpdate(shopId, {
      $addToSet : { 
        containers : { containerID: createdBanner.id , containerType: 'Banner' } 
      }
    });

    // if (Shop?.containers) {
    //   Shop.containers.push({
    //     containerID: createdBanner.id,
    //     containerType: 'Banner',
    //   });
    // } else {
    //   Shop.$set('containers', [
    //     {
    //       containerID: createdBanner.id,
    //       containerType: 'Banner',
    //     },
    //   ]);
    // }
    // await Shop.save();
    return { banner : createdBanner };
  }

  async findAll( query:QueryBannerDto ){
    const {query:result,paginationObj}=await this.apiService.getAllDocs(this.bannerModel.find(),query);
    const banners=await result;
    if( banners.length == 0  ){
      throw new HttpException("banner not found",400);
    };
    return { banners , pagination : paginationObj };
  }

  async findOne(id: string) {
    const banner = await this.bannerModel.findById(id);
    if (!banner) {
      throw new NotFoundException('this banner not found');
    }
    return {banner};
  }

  async update(
    id: string,
    updateBannerDto: UpdateBannerDto,
    user:IAuthUser
  ) {
    const banner= this.bannerModel
      .findOneAndUpdate({ _id:id,shopId:user.shopId}, updateBannerDto, { new: true });
    if (!banner) {
      throw new NotFoundException('this banner not found');
    };
    return { banner };
  }

  async remove(id: string,user:IAuthUser) {
    const banner = await this.bannerModel.findOne({
      _id:id,shopId:user.shopId
    });
    if (!banner) throw new NotFoundException("this banner doesn't exist");

    // const shop = await this.shopModel.findById(banner.shopId);
    const shop=await this.shopModel
      .findByIdAndUpdate( banner.shopId , { $pull : { containerID : id } });
    if (!shop) throw new NotFoundException("this shop doesn't exist");
    // for (let i = 0; i < shop.containers.length; i++) {
    //   if (shop.containers[i].containerID.toString() === id) {
    //     shop.containers.splice(i, 1);
    //     break;
    //   }
    // }
    // await shop.save();
    await this.bannerModel.findByIdAndDelete(id);
    return {status:'banner has been deleted successfully!'};
  }
}
