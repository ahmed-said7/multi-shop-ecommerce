import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from './schemas/coupon.schema';
import { User, UserSchema } from 'src/user/schemas/user_schema';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
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
import { Cart, CartSchema } from 'src/cart/schemas/cart.schema';
import { Category, CategorySchema } from 'src/category/schemas/category_schema';
import {
  VideoContainer,
  VideoContainerSchema,
} from 'src/video-container/schemas/videoContainer-schema';
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
import { CartModule } from 'src/cart/cart.module';
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coupon.name, schema: CouponSchema },
      { name: User.name, schema: UserSchema },
      { name: Merchant.name, schema: merchantSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Order.name, schema: OrderSchema },
      { name: PhotoSlider.name, schema: PhotoSliderSchema },
      { name: ProductSlider.name, schema: ProductSliderSchema },
      { name: Cart.name, schema: CartSchema },
      { name: ReviewContainer.name, schema: ReviewContainerSchema },
      { name: Category.name, schema: CategorySchema },
      { name: VideoContainer.name, schema: VideoContainerSchema },
      { name: Banner.name, schema: BannerSchema },
      { name: IntroPage.name, schema: IntroPageSchema },
    ]),
    CartModule,
    ApiModule,
  ],
  controllers: [CouponController],
  providers: [CouponService, CustomI18nService],
  exports: [CouponService],
})
export class CouponModule {}
