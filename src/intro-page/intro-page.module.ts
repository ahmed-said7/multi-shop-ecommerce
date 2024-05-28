import { Module } from '@nestjs/common';
import { IntroPageService } from './intro-page.service';
import { IntroPageController } from './intro-page.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import { IntroPage, IntroPageSchema } from './schemas/intro_page_schema';
import { User, UserSchema } from 'src/user/schemas/user_schema';
import {
  PhotoSlider,
  PhotoSliderSchema,
} from 'src/photo-slider/schemas/photo-slider_schema';
import { Coupon, CouponSchema } from 'src/coupon/schemas/coupon.schema';
import { Item, ItemSchema } from 'src/item/schemas/item-schema';
import { Order, OrderSchema } from 'src/order/schemas/order_schema';
import {
  ProductSlider,
  ProductSliderSchema,
} from 'src/product-slider/schemas/productSlider_schema';
import {
  ReviewContainer,
  ReviewContainerSchema,
} from 'src/review-container/schemas/reviewContainer_schema';
import { Category, CategorySchema } from 'src/category/schemas/category_schema';
import { Cart, CartSchema } from 'src/cart/schemas/cart.schema';
import {
  VideoContainer,
  VideoContainerSchema,
} from 'src/video-container/schemas/videoContainer-schema';
import { Banner, BannerSchema } from 'src/banner/schemas/banner_schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IntroPage.name, schema: IntroPageSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: User.name, schema: UserSchema },

      { name: PhotoSlider.name, schema: PhotoSliderSchema },

      { name: Coupon.name, schema: CouponSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Order.name, schema: OrderSchema },
      { name: ProductSlider.name, schema: ProductSliderSchema },
      { name: ReviewContainer.name, schema: ReviewContainerSchema },

      { name: Category.name, schema: CategorySchema },
      { name: Cart.name, schema: CartSchema },
      { name: VideoContainer.name, schema: VideoContainerSchema },
      { name: Banner.name, schema: BannerSchema },
    ]),
  ],
  controllers: [IntroPageController],
  providers: [IntroPageService],
})
export class IntroPageModule {}
