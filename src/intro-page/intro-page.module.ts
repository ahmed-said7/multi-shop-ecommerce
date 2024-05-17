import { Module } from '@nestjs/common';
import { IntroPageService } from './intro-page.service';
import { IntroPageController } from './intro-page.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import { IntroPage, IntroPageSchema } from './schemas/intro_page_schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IntroPage.name, schema: IntroPageSchema },
      { name: Shop.name, schema: ShopSchema },
    ]),
  ],
  controllers: [IntroPageController],
  providers: [IntroPageService],
})
export class IntroPageModule {}
