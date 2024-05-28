import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { Banner, BannerSchema } from './schemas/banner_schema';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import { User, UserSchema } from 'src/user/schemas/user_schema';
import { JwtModule } from '@nestjs/jwt';
import { Coupon, CouponSchema } from 'src/coupon/schemas/coupon.schema';
import { Item, ItemSchema } from 'src/item/schemas/item-schema';
import { Order, OrderSchema } from 'src/order/schemas/order_schema';
import {
  ProductSlider,
  ProductSliderSchema,
} from 'src/product-slider/schemas/productSlider_schema';
import { Category, CategorySchema } from 'src/category/schemas/category_schema';
import { Cart, CartSchema } from 'src/cart/schemas/cart.schema';
import {
  VideoContainer,
  VideoContainerSchema,
} from 'src/video-container/schemas/videoContainer-schema';
import {
  ReviewContainer,
  ReviewContainerSchema,
} from 'src/review-container/schemas/reviewContainer_schema';
import {
  PhotoSlider,
  PhotoSliderSchema,
} from 'src/photo-slider/schemas/photo-slider_schema';
import { IntroPage, IntroPageSchema } from 'src/intro-page/schemas/intro_page_schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Banner.name, schema: BannerSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: User.name, schema: UserSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Order.name, schema: OrderSchema },
      { name: ProductSlider.name, schema: ProductSliderSchema },
      { name: ReviewContainer.name, schema: ReviewContainerSchema },
      { name: PhotoSlider.name, schema: PhotoSliderSchema },
      { name: IntroPage.name, schema: IntroPageSchema },

      { name: Category.name, schema: CategorySchema },
      { name: Cart.name, schema: CartSchema },
      { name: VideoContainer.name, schema: VideoContainerSchema },
    ]),
    JwtModule.register({
      secret: `${process.env.SECRET}`,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
