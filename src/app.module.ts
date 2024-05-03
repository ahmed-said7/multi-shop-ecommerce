import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopModule } from './shop/shop.module';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { OrderModule } from './order/order.module';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { CouponModule } from './coupon/coupon.module';
// import { ReportsModule } from './reports/reports.module';
import { AdminModule } from './admin/admin.module';
import { PhotoSlideModule } from './photo-slide/photo-slide.module';
import { ProductSliderModule } from './product-slider/product-slider.module';
import { ReviewContainerModule } from './review-container/review-container.module';
import { CardSliderModule } from './card-slider/card-slider.module';
import { CategoryModule } from './category/category.module';
import { ReviewModule } from './review/review.module';
import { CardModule } from './card/card.module';
import { IntroPageModule } from './intro-page/intro-page.module';
import { AdminRequestsModule } from './admin-requests/admin-requests.module';
import { VideoContainerModule } from './video-container/video-container.module';
import { PhotoSliderModule } from './photo-slider/photo-slider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.register({
      secret: `${process.env.SECRET}`,
      signOptions: { expiresIn: '1d' },
      global: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    ShopModule,
    UserModule,
    AuthModule,
    AdminModule,
    ReviewContainerModule,
    ItemModule,
    OrderModule,
    CouponModule,
    // ReportsModule,
    CardSliderModule,
    ProductSliderModule,
    PhotoSliderModule,
    CategoryModule,
    ReviewModule,
    PassportModule,
    CardModule,
    IntroPageModule,
    AdminRequestsModule,
    VideoContainerModule,
    PhotoSlideModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
