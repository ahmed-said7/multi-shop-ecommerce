import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotoSliderController } from './photo-slider.controller';
import { PhotoSliderService } from './photo-slider.service';
import { PhotoSlider, PhotoSliderSchema } from './schemas/photo-slider_schema';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import { User, UserSchema } from 'src/user/schemas/user_schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhotoSlider.name, schema: PhotoSliderSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PhotoSliderController],
  providers: [PhotoSliderService],
})
export class PhotoSliderModule {}
