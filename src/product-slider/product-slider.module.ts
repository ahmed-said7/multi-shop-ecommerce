import { Module } from '@nestjs/common';
import { ProductSliderService } from './product-slider.service';
import { ProductSliderController } from './product-slider.controller';
import {
  ProductSlider,
  ProductSliderSchema,
} from './schemas/productSlider_schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import { UserModule } from 'src/user/user.module'; // Import UserModule
import { JwtService } from '@nestjs/jwt';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Coupon, CouponSchema } from 'src/coupon/schemas/coupon.schema';
import { User, UserSchema } from 'src/user/schemas/user_schema';
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
import {
  ReviewContainer,
  ReviewContainerSchema,
} from 'src/review-container/schemas/reviewContainer_schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductSlider.name, schema: ProductSliderSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: User.name, schema: UserSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Order.name, schema: OrderSchema },
      { name: PhotoSlider.name, schema: PhotoSliderSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Cart.name, schema: CartSchema },
      { name: VideoContainer.name, schema: VideoContainerSchema },
      { name: ReviewContainer.name, schema: ReviewContainerSchema },
    ]),
    UserModule, // Import UserModule
  ],
  controllers: [ProductSliderController],
  providers: [ProductSliderService, JwtService, JwtGuard],
  exports: [ProductSliderService],
})
export class ProductSliderModule {}
