import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user_schema';
import { UserModule } from 'src/user/user.module';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import { AdminStatisticsController } from './admin-statistics.controller';
import { Merchant, merchantSchema } from 'src/merchant/schema/merchant.schema';
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Merchant.name, schema: merchantSchema },
      { name: Shop.name, schema: ShopSchema },
    ]),
    UserModule,
  ],
  controllers: [AdminController, AdminStatisticsController],
  providers: [AdminService, CustomI18nService],
})
export class AdminModule {}
