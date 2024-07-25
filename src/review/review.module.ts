import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review, ReviewSchema } from './schemas/review_schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user_schema';
import { Merchant, merchantSchema } from 'src/merchant/schema/merchant.schema';
import { ApiModule } from 'src/common/filter/api.module';
import { Item, ItemSchema } from 'src/item/schemas/item-schema';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Item.name, schema: ItemSchema },
      { name: User.name, schema: UserSchema },
      { name: Shop.name, schema: ShopSchema },
      { name:Merchant.name , schema:merchantSchema }
    ])
    ,ApiModule
  ],
  controllers: [ReviewController],
  providers: [ReviewService,CustomI18nService],
  exports: [ReviewService],
})
export class ReviewModule {}
