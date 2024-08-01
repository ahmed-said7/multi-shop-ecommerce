import { Module } from '@nestjs/common';
import { VideoContainerService } from './video-container.service';
import { VideoContainerController } from './video-container.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import {
  VideoContainer,
  VideoContainerSchema,
} from './schemas/videoContainer-schema';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/user/schemas/user_schema';
import { Coupon, CouponSchema } from 'src/coupon/schemas/coupon.schema';
import { Item, ItemSchema } from 'src/item/schemas/item-schema';
import { Order, OrderSchema } from 'src/order/schemas/order_schema';
import {
  PhotoSlider,
  PhotoSliderSchema,
} from 'src/photo-slider/schemas/photo-slider_schema';
import {
  ProductSlider,
  ProductSliderSchema,
} from 'src/product-slider/schemas/productSlider_schema';
import { Category, CategorySchema } from 'src/category/schemas/category_schema';
import { Cart, CartSchema } from 'src/cart/schemas/cart.schema';
import {
  ReviewContainer,
  ReviewContainerSchema,
} from 'src/review-container/schemas/reviewContainer_schema';
import { Banner, BannerSchema } from 'src/banner/schemas/banner_schema';
import {
  IntroPage,
  IntroPageSchema,
} from 'src/intro-page/schemas/intro_page_schema';
import { Merchant, merchantSchema } from 'src/merchant/schema/merchant.schema';
import { ApiModule } from 'src/common/filter/api.module';
import { UploadModule } from 'src/upload/upload.module';
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VideoContainer.name, schema: VideoContainerSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: User.name, schema: UserSchema },
      { name: Merchant.name, schema: merchantSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Order.name, schema: OrderSchema },
      { name: PhotoSlider.name, schema: PhotoSliderSchema },
      { name: ProductSlider.name, schema: ProductSliderSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Cart.name, schema: CartSchema },
      { name: ReviewContainer.name, schema: ReviewContainerSchema },
      { name: Banner.name, schema: BannerSchema },
      { name: IntroPage.name, schema: IntroPageSchema },
    ]),
    ApiModule,
    UploadModule,
  ],
  controllers: [VideoContainerController],
  providers: [
    VideoContainerService,
    { provide: 'field', useValue: 'link' },
    CustomI18nService,
  ],
})
export class VideoContainerModule {}
