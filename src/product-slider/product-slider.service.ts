import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductSliderDto } from './dto/create-product-slider.dto';
import { UpdateProductSliderDto } from './dto/update-product-slider.dto';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ProductSlider,
  ProductSliderDocument,
} from './schemas/productSlider_schema';
import { ApiService } from 'src/common/filter/api.service';
import { QueryProductSliderDto } from './dto/query-product-slider.dto';

@Injectable()
export class ProductSliderService {
  constructor(
    @InjectModel(ProductSlider.name)
    private productSliderModel: Model<ProductSliderDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    private apiService: ApiService<ProductSliderDocument,QueryProductSliderDto>
  ) {};

  async create(body: CreateProductSliderDto, shopId: string) {
      const payload = {
        ... body ,
        shopId
      };
      const productSlider = await this.productSliderModel.create(payload);
      await this.shopModel.findByIdAndUpdate(
        shopId,
        {
          $addToSet:{
            containers : { 
              containerID: productSlider.id ,
              containerType: 'ProductSlider'
            }
          }
        }
      );
      return {productSlider};
  }

  async findAll(query:QueryProductSliderDto) {
    const {query:result,paginationObj}=await this.apiService
      .getAllDocs(this.productSliderModel.find(),query,["title"]);
    const productSliders=await result.populate({
      path: 'products',
      model: 'Item',
      select: 'name price description images',
    });
    if( productSliders.length == 0  ){
      throw new HttpException("product sliders not found",400);
    };
    return { productSliders , pagination : paginationObj };
  }
  async findOne(id: string) {
    const productSlider = await this.productSliderModel
      .findById(id)
      .populate({
        path: 'products',
        model: 'Item',
        select: 'name price description images',
      });
      if(!productSlider){
        throw new HttpException("ProductSlider not found",400);
      }
      return {productSlider};
  }

  async update( id: string , shopId:string , body: UpdateProductSliderDto ){
      const productSlider = await this.productSliderModel.findOneAndUpdate(
        { _id:id,shopId },
        body,
        {
          new: true,
        },
      );
      if (!productSlider) {
        throw new NotFoundException('this product slider not found');
      }
      return {productSlider};
  };

  async remove(id: string, shopId: string) {
    const productSlider = await this.productSliderModel.findOneAndDelete({ _id:id,shopId });
    if (!productSlider) {
      throw new NotFoundException('this product slider not found');
    }
    await this.shopModel.findByIdAndUpdate(shopId,
    {
      $pull:{
        containers : { 
          containerID: id
        }
      }
    });
    return {status:'Prouct Slider has been deleted successfully!'};
  }
}
