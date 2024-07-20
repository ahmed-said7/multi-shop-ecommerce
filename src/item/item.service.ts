import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item, ItemDocument } from './schemas/item-schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { ApiService } from 'src/common/filter/api.service';
import { QueryItemDto } from './dto/query-item.dto';
import { Category, CategoryDocument } from 'src/category/schemas/category_schema';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    @InjectModel(Category.name) private catModel: Model<CategoryDocument>,
    private apiService:ApiService<ItemDocument,QueryItemDto>
  ) {};

  async create(createItemDto: CreateItemDto, shopId: string) {
    await this.validateCategory(createItemDto.category);
    const item = await this.itemModel.create({ ... createItemDto , shopId });
    await this.shopModel.findByIdAndUpdate(item.shopId,{$addToSet:{itemsIDs:item._id}});
    return {item};
  }

  async findAll(
    query:QueryItemDto
  ) {
    // const filter={ shopId:new Types.ObjectId(shopId) };
    const {query:result,paginationObj}=await this.apiService
      .getAllDocs(this.itemModel.find(),query,["name","description"]);
    const items=await result;
    if( items.length == 0  ){
      throw new HttpException("items not found",400);
    };
    return { items , pagination : paginationObj };
  }

  async findOne(id: string) {
      const item = await this.itemModel.findById(id);
      if (!item) throw new NotFoundException('Item not found!');
      return {item};
  }

  async update(id: string, shopId:string,updateItemDto: UpdateItemDto) {
    if(updateItemDto.category){
      await this.validateCategory(updateItemDto.category);
    }
    const item = await this.itemModel.findOneAndUpdate({_id:id,shopId}, updateItemDto, {
      new: true,
    });
    if (!item) throw new NotFoundException('Item not found!');
    return { item };
  }

  async remove( id: string , shopId: string ) {
    const item = await this.itemModel.findOneAndDelete({_id:id,shopId});
    if (!item) throw new NotFoundException('Item not found!');
    return { item };
  };
  private async validateCategory(id:string){
    const category = await this.catModel.findById(id);
    if (!category) throw new NotFoundException('category id not found');
  };
}
