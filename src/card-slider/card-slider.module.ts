import { Module } from '@nestjs/common';
import { CardSliderService } from './card-slider.service';
import { CardSliderController } from './card-slider.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import { CardSlider, CardSliderSchema } from './schemas/cardSlider_schema';
import { Card, CardSchema } from 'src/card/schemas/card_schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CardSlider.name, schema: CardSliderSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: Card.name, schema: CardSchema },
    ]),
  ],
  controllers: [CardSliderController],
  providers: [CardSliderService],
  exports: [CardSliderService],
})
export class CardSliderModule {}
