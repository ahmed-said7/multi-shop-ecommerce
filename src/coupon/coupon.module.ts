import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from './schemas/coupon.schema';
import { User, UserSchema } from 'src/user/schemas/user_schema';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coupon.name, schema: CouponSchema },
      { name: User.name, schema: UserSchema },
      { name: Shop.name, schema: ShopSchema },
    ]),
  ],
  controllers: [CouponController],
  providers: [CouponService],
})
export class CouponModule {}
