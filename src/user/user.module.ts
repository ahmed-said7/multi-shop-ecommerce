import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from './schemas/user_schema';
import { Otp, OtpSchema } from './schemas/otp-schema';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import { Item, ItemSchema } from 'src/item/schemas/item-schema';
import { Category, CategorySchema } from 'src/category/schemas/category_schema';
import {
  ProductSlider,
  ProductSliderSchema,
} from 'src/product-slider/schemas/productSlider_schema';
import {
  CardSlider,
  CardSliderSchema,
} from 'src/card-slider/schemas/cardSlider_schema';
import {
  PhotoSlider,
  PhotoSliderSchema,
} from 'src/photo-slider/schemas/photo-slider_schema';
import { Review, ReviewSchema } from 'src/review/schemas/review_schema';
import {
  ReviewContainer,
  ReviewContainerSchema,
} from 'src/review-container/schemas/reviewContainer_schema';
import { Order, OrderSchema } from 'src/order/schemas/order_schema';
import { OtpService } from './otp/otp.service';
import { OtpController } from './otp/otp.controller';
import { EmailService } from './email/email.service';
import { ShopService } from './shop.service';
import { UserTrackController } from './track.controller';
import { TrackService } from './track.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Category.name, schema: CategorySchema },
      { name: ProductSlider.name, schema: ProductSliderSchema },
      { name: CardSlider.name, schema: CardSliderSchema },
      { name: PhotoSlider.name, schema: PhotoSliderSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: ReviewContainer.name, schema: ReviewContainerSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [UserController, OtpController, UserTrackController],
  providers: [UserService, OtpService, EmailService, ShopService, TrackService],
  exports: [UserService, MongooseModule], // Export UserService and MongooseModule
})
export class UserModule {}
