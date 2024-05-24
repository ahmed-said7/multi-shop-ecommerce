import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThemesController } from './themes.controller';
import { ThemesService } from './themes.service';
import { Theme, ThemeSchema } from './schemas/theme.schema';
import { User, UserSchema } from 'src/user/schemas/user_schema';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Theme.name, schema: ThemeSchema },
      { name: User.name, schema: UserSchema },
      { name: Shop.name, schema: ShopSchema },
    ]),
  ],
  controllers: [ThemesController],
  providers: [ThemesService],
})
export class ThemesModule {}
