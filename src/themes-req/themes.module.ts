import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThemesController } from './themes.controller';
import { ThemesService } from './themes.service';
import { Theme, ThemeSchema } from './schemas/theme.schema';
import { User, UserSchema } from 'src/user/schemas/user_schema';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import { Coupon, CouponSchema } from 'src/coupon/schemas/coupon.schema';
import { Item, ItemSchema } from 'src/item/schemas/item-schema';
import { Order, OrderSchema } from 'src/order/schemas/order_schema';
import { PhotoSlider, PhotoSliderSchema } from 'src/photo-slider/schemas/photo-slider_schema';
import { ProductSlider, ProductSliderSchema } from 'src/product-slider/schemas/productSlider_schema';
import { Cart, CartSchema } from 'src/cart/schemas/cart.schema';
import { Category, CategorySchema } from 'src/category/schemas/category_schema';
import { VideoContainer, VideoContainerSchema } from 'src/video-container/schemas/videoContainer-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Theme.name, schema: ThemeSchema },
      { name: User.name, schema: UserSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: User.name, schema: UserSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Order.name, schema: OrderSchema },
      { name: PhotoSlider.name, schema: PhotoSliderSchema },
      { name: ProductSlider.name, schema: ProductSliderSchema },
      
      { name: Cart.name, schema: CartSchema },
      { name: Category.name, schema: CategorySchema },
      { name: VideoContainer.name, schema: VideoContainerSchema },
    ]),
  ],
  controllers: [ThemesController],
  providers: [ThemesService],
})
export class ThemesModule {}
