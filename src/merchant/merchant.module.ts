import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Merchant } from './schema/merchant.schema';
import { MerchantService } from './merchant.service';
import { MerchantController } from './merchant.controller';

import { ShopModule } from 'src/shop/shop.module';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import { MerchantSchema } from 'src/user/schemas/merchant_schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shop.name, schema: ShopSchema },
      { name: Merchant.name, schema: MerchantSchema },
    ]),

    ShopModule,
  ],
  controllers: [MerchantController],
  providers: [MerchantService],
})
export class MerchantModule {}
