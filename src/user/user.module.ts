import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { User, UserSchema } from "./schemas/user_schema";
import { Shop, ShopSchema } from "../shop/schemas/shop_schema";
import { Item, ItemSchema } from "../item/schemas/item-schema";
import { Category, CategorySchema } from "../category/schemas/category_schema";
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
import { Order, OrderSchema } from "../order/schemas/order_schema";
import { UserTrackController } from "./track.controller";
import { TrackService } from "./track.service";
import { Coupon, CouponSchema } from "../coupon/schemas/coupon.schema";
import { Cart, CartSchema } from "../cart/schemas/cart.schema";
import {
  VideoContainer,
  VideoContainerSchema,
} from "../video-container/schemas/videoContainer-schema";
import { Banner, BannerSchema } from "../banner/schemas/banner_schema";
import {
  IntroPage,
  IntroPageSchema,
} from '../i18n/intro-page/schemas/intro_page_schema';
import { UploadModule } from 'src/upload/upload.module';
import { ApiModule } from 'src/common/filter/api.module';
import { Merchant, merchantSchema } from "src/merchant/schema/merchant.schema";
import { jwtTokenModule } from "src/jwt/jwt.module";
import { CustomI18nService } from "src/common/custom-i18n.service";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
      { name: Order.name, schema: OrderSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: IntroPage.name, schema: IntroPageSchema },
      { name: Cart.name, schema: CartSchema },
      { name: VideoContainer.name, schema: VideoContainerSchema },
      { name: Banner.name, schema: BannerSchema },
    ]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: "1h" },
    }),
    jwtTokenModule,
    UploadModule,ApiModule
  ],
  controllers: [UserController, UserTrackController],
  providers: [UserService,  TrackService,CustomI18nService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
