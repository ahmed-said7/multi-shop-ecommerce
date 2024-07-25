import {
  HttpException,
  Injectable
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review_schema';
import { QueryReviewDto } from './dto/query-review.dto';
import { ApiService } from 'src/common/filter/api.service';
import { IAuthUser } from 'src/common/enums';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Item, ItemDocument } from 'src/item/schemas/item-schema';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    private apiService:ApiService<ReviewDocument,QueryReviewDto>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    private eventEmitter:EventEmitter2,
    private i18n:CustomI18nService
  ) {};
  async create(body: CreateReviewDto) {
    const reviewExist=await this.reviewModel.findOne({
      user:body.user,
      item:body.item
    });
    if( reviewExist ){
      throw new HttpException(this.i18n.translate("test.review.duplicate"),400);
    }
    const item = await this.itemModel.findById(body.item);
    if( !item ) {
      throw new HttpException(this.i18n.translate("test.items.notFound"),400)
    };
    body.shopId=item.shopId.toString();
    const review = await  this.reviewModel.create(body);
    this.eventEmitter.emit("review.saved",{ itemId: review.item });
    return { review };
  };

  async findAll(query:QueryReviewDto) {
    const {query:result,paginationObj}=await this.apiService
      .getAllDocs(this.reviewModel.find(),query);
    const reviews=await result
      .populate({ path: 'user', model: 'User', select: 'name' })
      // .populate({ path: 'item', model: 'Item', select: 'name images' });
    if( reviews.length == 0  ){
      throw new HttpException(this.i18n.translate("test.review.notFound"),400);
    };
    return { reviews , pagination : paginationObj };
  };

  async findOne(id: string) {
      const review = await this.reviewModel
        .findById(id)
        .populate({ path: 'user', model: 'User', select: 'name' })
        .populate({ path: 'item', model: 'Item', select: 'name images' });
      if(! review ){
        throw new HttpException(this.i18n.translate("test.review.notFound"),400);
      }
      return { review };
  };

  async update(id: string,user:IAuthUser, updateReviewDto: UpdateReviewDto) {
      const review = await this.reviewModel
          .findOneAndUpdate
            ( { _id: id,user: user._id }, updateReviewDto,{new:true})
            .populate({ path: 'user', model: 'User', select: 'name' });
      if(!review) {
        throw new HttpException(this.i18n.translate("test.review.notFound"),400);
      };
      await review.save();
      this.eventEmitter.emit("review.saved",{ itemId: review.item });
      return {review};
  };

  async remove(id: string, user: IAuthUser) {
      const review=await this.reviewModel.findOneAndDelete({
        _id: id,user: user._id
      });
      if(!review) {
        throw new HttpException(this.i18n.translate("test.review.notFound"),400);
      };
      this.eventEmitter.emit("review.removed",{ itemId: review.item });
      return {status:this.i18n.translate("test.review.deleted")};
  };
  private async aggregation(item:string){
    const result=await this.reviewModel.aggregate([
      { $match : { item } },
      { 
        $group : {
          _id:"$item",
          rating:{$avg:"$rating"}
        } 
      }
    ]);
    if(result.length > 0){
      const {rating}=result[0];
      await this.itemModel.findByIdAndUpdate(item,{rating});
    }else{
      await this.itemModel.findByIdAndUpdate(item,{rating:0});
    };
  };
  @OnEvent("review.saved")
  async handleSavedReview({itemId}){
    await this.aggregation(itemId);
  };
  @OnEvent("review.removed")
  async handleRemovedReview({itemId}){
    await this.aggregation(itemId);
  };
};
