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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductSlider.name, schema: ProductSliderSchema },
      { name: Shop.name, schema: ShopSchema },
    ]),
    UserModule, // Import UserModule
  ],
  controllers: [ProductSliderController],
  providers: [ProductSliderService, JwtService, JwtGuard],
  exports: [ProductSliderService],
})
export class ProductSliderModule {}
