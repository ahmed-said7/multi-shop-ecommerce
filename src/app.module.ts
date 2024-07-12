import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { CouponModule } from './coupon/coupon.module';
import { ReportsModule } from './reports/reports.module';
import { AdminModule } from './admin/admin.module';
import { ProductSliderModule } from './product-slider/product-slider.module';
import { ReviewContainerModule } from './review-container/review-container.module';
import { CategoryModule } from './category/category.module';
import { ReviewModule } from './review/review.module';
import { IntroPageModule } from './intro-page/intro-page.module';
import { AdminRequestsModule } from './admin-requests/admin-requests.module';
import { VideoContainerModule } from './video-container/video-container.module';
import { PhotoSliderModule } from './photo-slider/photo-slider.module';
import { ThemesModule } from './themes-req/themes.module';
import { FileManagerModule } from './file-manager/file-manager.module';
import { CartModule } from './cart/cart.module';
import { BannerModule } from './banner/banner.module';
import { UploadModule } from './upload/upload.module';
import { MerchantModule } from './merchant/merchant.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { extension } from 'mime-types';
import { APP_FILTER } from '@nestjs/core';
import { catchExceptionsFilter } from './common/errorHandler/base.filter';
import { ShopModule } from './shop/shop.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1d' },
      global: true,
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './images/',
        filename(_req, file, callback) {
          const nowDate = DateTime.now().toISODate();

          const name = `${file.originalname.split('.').at(0)}-${nowDate}-${uuid()}.${extension(file.mimetype)}`;

          callback(null, name);
        },
      }),
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    UserModule,
    AuthModule,
    ShopModule,
    AdminModule,
    ReviewContainerModule,
    ItemModule,
    OrderModule,
    CouponModule,
    ReportsModule,
    ProductSliderModule,
    BannerModule,
    PhotoSliderModule,
    CategoryModule,
    ReviewModule,
    PassportModule,
    IntroPageModule,
    AdminRequestsModule,
    VideoContainerModule,
    ThemesModule,
    FileManagerModule,
    CartModule,
    UploadModule,
    MerchantModule,
  ],
  controllers: [AppController],
  providers: [ AppService , { provide:APP_FILTER , useClass: catchExceptionsFilter } ],
  exports: [MongooseModule],
})
export class AppModule {}
