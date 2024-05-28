import { Module } from '@nestjs/common';
import { ReviewContainerService } from './review-container.service';
import { ReviewContainerController } from './review-container.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import { User, UserSchema } from 'src/user/schemas/user_schema';
import {
  ReviewContainer,
  ReviewContainerSchema,
} from './schemas/reviewContainer_schema';
import { Review, ReviewSchema } from 'src/review/schemas/review_schema';
import {
  ProductSlider,
  ProductSliderSchema,
} from 'src/product-slider/schemas/productSlider_schema';
import { Coupon, CouponSchema } from 'src/coupon/schemas/coupon.schema';
import { Item, ItemSchema } from 'src/item/schemas/item-schema';
import { Order, OrderSchema } from 'src/order/schemas/order_schema';
import {
  PhotoSlider,
  PhotoSliderSchema,
} from 'src/photo-slider/schemas/photo-slider_schema';
import { Category, CategorySchema } from 'src/category/schemas/category_schema';
import { Cart, CartSchema } from 'src/cart/schemas/cart.schema';
import {
  VideoContainer,
  VideoContainerSchema,
} from 'src/video-container/schemas/videoContainer-schema';
import { Banner, BannerSchema } from 'src/banner/schemas/banner_schema';
import {
  IntroPage,
  IntroPageSchema,
} from 'src/intro-page/schemas/intro_page_schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReviewContainer.name, schema: ReviewContainerSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: User.name, schema: UserSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: ProductSlider.name, schema: ProductSliderSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Order.name, schema: OrderSchema },
      { name: PhotoSlider.name, schema: PhotoSliderSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Cart.name, schema: CartSchema },
      { name: VideoContainer.name, schema: VideoContainerSchema },
      { name: Banner.name, schema: BannerSchema },
      { name: IntroPage.name, schema: IntroPageSchema },
    ]),
  ],
  controllers: [ReviewContainerController],
  providers: [ReviewContainerService],
  exports: [ReviewContainerService],
})
export class ReviewContainerModule {}
