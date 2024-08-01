import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Merchant, merchantSchema } from './schema/merchant.schema';
import { MerchantService } from './merchant.service';
import { MerchantController } from './merchant.controller';
import { ShopModule } from 'src/shop/shop.module';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import { AuthModule } from 'src/auth/auth.module';
import { ApiModule } from 'src/common/filter/api.module';
import { User, UserSchema } from 'src/user/schemas/user_schema';
import { jwtTokenModule } from 'src/jwt/jwt.module';
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shop.name, schema: ShopSchema },
      { name: User.name, schema: UserSchema },
      { name: Merchant.name, schema: merchantSchema },
    ]),
    jwtTokenModule,
    ShopModule,
    AuthModule,
    ApiModule,
  ],
  controllers: [MerchantController],
  providers: [MerchantService, CustomI18nService],
})
export class MerchantModule {}
