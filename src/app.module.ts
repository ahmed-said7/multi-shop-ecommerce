import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { CartModule } from './cart/cart.module';
import { BannerModule } from './banner/banner.module';
import { UploadModule } from './upload/upload.module';
import { MerchantModule } from './merchant/merchant.module';
import { APP_FILTER } from '@nestjs/core';
import { catchExceptionsFilter } from './common/errorHandler/base.filter';
import { ShopModule } from './shop/shop.module';
import { jwtTokenModule } from './jwt/jwt.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { I18nModule, QueryResolver } from 'nestjs-i18n';

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
    jwtTokenModule,
    I18nModule.forRoot({
      loaderOptions: {
        path: 'src/i18n/',
        watch: true,
      },
      fallbackLanguage: 'ar',
      resolvers: [{ use: QueryResolver, options: ['lang'] }],
    }),
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: './images/',
    //     filename(_req, file, callback) {
    // }),      const nowDate = DateTime.now().toISODate();

    //       const name = `${file.originalname.split('.').at(0)}-${nowDate}-${uuid()}.${extension(file.mimetype)}`;

    //       callback(null, name);
    //     },
    //   }),
    EventEmitterModule.forRoot({ global: true }),
    MongooseModule.forRootAsync({
      useFactory(config: ConfigService) {
        return { uri: config.get('DB_URI') };
      },
      inject: [ConfigService],
    }),
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
    CartModule,
    UploadModule,
    MerchantModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: catchExceptionsFilter },
    // ,{ provide:APP_FILTER , useClass: I18nValidationExceptionFilter }
  ],
  exports: [MongooseModule],
})
export class AppModule {}
