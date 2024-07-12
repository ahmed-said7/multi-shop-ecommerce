import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from './schemas/shop_schema';
import { ReviewModule } from 'src/review/review.module';
import { Review, ReviewSchema } from 'src/review/schemas/review_schema';
import {
  ProductSlider,
  ProductSliderSchema,
} from 'src/product-slider/schemas/productSlider_schema';
import {
  PhotoSlider,
  PhotoSliderSchema,
} from 'src/photo-slider/schemas/photo-slider_schema';

import { PhotoSliderModule } from 'src/photo-slider/photo-slider.module';
import { ProductSliderModule } from 'src/product-slider/product-slider.module';
import { Category, CategorySchema } from 'src/category/schemas/category_schema';
import { Item, ItemSchema } from 'src/item/schemas/item-schema';
import { User, UserSchema } from 'src/user/schemas/user_schema';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryModule } from 'src/category/category.module';
import { ItemModule } from 'src/item/item.module';
import {
  ReviewContainer,
  ReviewContainerSchema,
} from 'src/review-container/schemas/reviewContainer_schema';
import { ReviewContainerModule } from 'src/review-container/review-container.module';
import {
  VideoContainer,
  VideoContainerSchema,
} from 'src/video-container/schemas/videoContainer-schema';
import { JwtModule } from '@nestjs/jwt';
import { Coupon, CouponSchema } from 'src/coupon/schemas/coupon.schema';
import { Order, OrderSchema } from 'src/order/schemas/order_schema';
import { Cart, CartSchema } from 'src/cart/schemas/cart.schema';
import { Banner, BannerSchema } from 'src/banner/schemas/banner_schema';
import { BannerModule } from 'src/banner/banner.module';
import { VideoContainerModule } from 'src/video-container/video-container.module';
import {
  IntroPage,
  IntroPageSchema,
} from 'src/intro-page/schemas/intro_page_schema';
import { UploadModule } from 'src/upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shop.name, schema: ShopSchema },
      { name: Item.name, schema: ItemSchema },
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: ProductSlider.name, schema: ProductSliderSchema },
      { name: PhotoSlider.name, schema: PhotoSliderSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: ReviewContainer.name, schema: ReviewContainerSchema },
      { name: VideoContainer.name, schema: VideoContainerSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
      { name: ReviewContainer.name, schema: ReviewContainerSchema },
      { name: Banner.name, schema: BannerSchema },
      { name: IntroPage.name, schema: IntroPageSchema },
    ]),
    JwtModule.register({
      secret: `${process.env.SECRET}`,
      signOptions: { expiresIn: '1h' },
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './images/shop',
      }),
    }),
    AuthModule,
    ReviewContainerModule,
    ProductSliderModule,
    CategoryModule,
    ItemModule,
    ReviewModule,
    PhotoSliderModule,
    BannerModule,
    VideoContainerModule,
    UploadModule
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [MongooseModule, ShopService], // Export MongooseModule to make ShopModel available in other modules
})
export class ShopModule {}
