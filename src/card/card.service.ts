import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { Card, CardDocument } from './schemas/card_schema';
import {
  CardSlider,
  CardSliderDocument,
} from 'src/card-slider/schemas/cardSlider_schema';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    @InjectModel(CardSlider.name)
    private cardSliderModel: Model<CardSliderDocument>,
  ) {}
  async create(createCardDto: CreateCardDto) {
    try {
      const card = await this.cardModel.create(createCardDto);
      const cardSlider = await this.cardSliderModel.findById(
        createCardDto.cardSlider,
      );
      cardSlider.cards.push(card.id);
      await cardSlider.save();
      return card;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  async findAll(id: string) {
    try {
      const cards = await this.cardModel
        .find({ cardSlider: id })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      return cards;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const card = await this.cardModel.findById(id).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      return card;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    try {
      const card = await this.cardSliderModel
        .findByIdAndUpdate(id, updateCardDto, {
          new: true,
        })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });

      return card;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    const card = await this.cardModel.findById(id).catch((err) => {
      console.log(err);
      throw new InternalServerErrorException(err);
    });
    if (!card)
      throw new InternalServerErrorException("this slider doesn't exist");

    const cardSlider = await this.cardSliderModel
      .findById(card.cardSlider)
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
    for (let i = 0; i < cardSlider.cards.length; i++) {
      if (cardSlider.cards[i] === id) {
        cardSlider.cards.splice(i, 1);
        break;
      }
    }
    await cardSlider.save();
    await this.cardModel.findByIdAndDelete(id).catch((err) => {
      console.log(err);
      throw new InternalServerErrorException(err);
    });
    return 'card deleted successfully';
  }
}
