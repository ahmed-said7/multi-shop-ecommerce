import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CardSlider,
  CardSliderSchema,
} from 'src/card-slider/schemas/cardSlider_schema';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import { Card, CardSchema } from './schemas/card_schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CardSlider.name, schema: CardSliderSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: Card.name, schema: CardSchema },
    ]),
  ],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
