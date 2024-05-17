import { Module } from '@nestjs/common';
import { PhotoSlideService } from './photo-slide.service';
import { PhotoSlideController } from './photo-slide.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import { PhotoSlide, PhotoSlideSchema } from './schemas/photoSlide_schema';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/user/schemas/user_schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhotoSlide.name, schema: PhotoSlideSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({
      secret: `${process.env.SECRET}`,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [PhotoSlideController],
  providers: [PhotoSlideService],
  exports: [PhotoSlideService],
})
export class PhotoSlideModule {}
