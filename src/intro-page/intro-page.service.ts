import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateIntroPageDto } from './dto/create-intro-page.dto';
import { UpdateIntroPageDto } from './dto/update-intro-page.dto';
import { IntroPage, IntroPageDocument } from './schemas/intro_page_schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { ApiService } from 'src/common/filter/api.service';
import { QueryIntroPageDto } from './dto/query-intro-page.dto';

@Injectable()
export class IntroPageService {
  constructor(
    @InjectModel(IntroPage.name)
    private introPageModel: Model<IntroPageDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    private apiService:ApiService<IntroPageDocument,QueryIntroPageDto>
  ) {};
  async create(createIntroPageDto: CreateIntroPageDto, shopId: string) {
      const payload = {
        ...createIntroPageDto,
        shopId
      };
      const introPage = await this.introPageModel.create(payload);
      await this.shopModel
          .findByIdAndUpdate(shopId,{$addToSet:{introPages:introPage._id}});
      return {introPage};
  };

  async findAll(query:QueryIntroPageDto) {
    const {query:result,paginationObj}=await this.apiService.getAllDocs(this.introPageModel.find(),query);
    const IntroPages=await result;
    if( IntroPages.length == 0  ){
      throw new HttpException("coupon not found",400);
    };
    return { IntroPages , pagination : paginationObj };
  }

  async findOne(id: string) {
    const introPage = await this.introPageModel.findById(id);
    if (!introPage) {
      throw new NotFoundException('this page not found');
    };
    return { introPage };
  }

  async update(id: string,shopId:string, updateIntroPageDto: UpdateIntroPageDto) {
      const introPage = await this.introPageModel.findByIdAndUpdate(
        { _id:id , shopId },
        updateIntroPageDto,
        { new: true },
      );
      if( ! introPage ){
        throw new HttpException("No intro page found",400);
      };
      return { introPage };
  }

  async remove(id: string,shopId: string) {
      const introPage = await this.introPageModel.findOneAndDelete({ _id:id , shopId });
      if ( !introPage ) {
        throw new NotFoundException('this page not found');
      }
      await this.shopModel
          .findByIdAndUpdate(shopId,{$pull:{introPages:introPage.id}});
      return { status : 'Intro page has been deleted successfully' };
  }
}
