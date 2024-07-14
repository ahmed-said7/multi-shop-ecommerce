import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user_schema';
import { Shop, ShopSchema } from '../shop/schemas/shop_schema';
import { Item, ItemSchema } from '../item/schemas/item-schema';
import { Category, CategorySchema } from '../category/schemas/category_schema';
import {
  ProductSlider,
  ProductSliderSchema,
} from "../product-slider/schemas/productSlider_schema";
import {
  PhotoSlider,
  PhotoSliderSchema,
} from "../photo-slider/schemas/photo-slider_schema";
import { Review, ReviewSchema } from "../review/schemas/review_schema";
import {
  ReviewContainer,
  ReviewContainerSchema,
} from "../review-container/schemas/reviewContainer_schema";
import { Banner, BannerSchema } from "../banner/schemas/banner_schema";
import {
  VideoContainer,
  VideoContainerSchema,
} from "../video-container/schemas/videoContainer-schema";
import {
  IntroPage,
  IntroPageSchema,
} from "../intro-page/schemas/intro_page_schema";
import { UserModule } from "src/user/user.module";
import { Merchant, merchantSchema } from 'src/merchant/schema/merchant.schema';
import { jwtTokenModule } from 'src/jwt/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Merchant.name, schema: merchantSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Category.name, schema: CategorySchema },
      { name: ProductSlider.name, schema: ProductSliderSchema },
      { name: PhotoSlider.name, schema: PhotoSliderSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: ReviewContainer.name, schema: ReviewContainerSchema },
      { name: Banner.name, schema: BannerSchema },
      { name: VideoContainer.name, schema: VideoContainerSchema },
      { name: IntroPage.name, schema: IntroPageSchema },
    ]),
    jwtTokenModule,
    UserModule
  ],
  providers: [
    AuthService
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
