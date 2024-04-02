import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCardSliderDto } from './dto/create-card-slider.dto';
import { UpdateCardSliderDto } from './dto/update-card-slider.dto';
import { CardSlider, CardSliderDocument } from './schemas/cardSlider_schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { Card, CardDocument } from 'src/card/schemas/card_schema';

@Injectable()
export class CardSliderService {
  constructor(
    @InjectModel(CardSlider.name) private cardSliderModel: Model<CardSliderDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
  ) { }

  async create(createCardSliderDto: CreateCardSliderDto) {
    try {
      const cardSlider = await new this.cardSliderModel(createCardSliderDto).save();
      const shop = await this.shopModel.findById(createCardSliderDto.shop);
      shop.containers.push({ containerID: cardSlider.id, containerType: 'card slider' });
      await shop.save();
      return cardSlider;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  async findAll(id: string) {
    try {
      const cardSliders = await this.cardSliderModel.find({ shop: id }).populate({ path: 'cards', model: 'Card' }).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err);
      })
      return cardSliders;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const cardSlider = await this.cardSliderModel.findById(id).populate({ path: 'cards', model: 'Card' }).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err);


      });
      if (!cardSlider) throw new NotFoundException("this slider doesn't exist")
      return cardSlider;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateCardSliderDto: UpdateCardSliderDto) {
    try {
      const cardSlider = await this.cardSliderModel.findByIdAndUpdate(id, updateCardSliderDto, {
        new: true,
      }).populate({ path: 'cards', model: 'Card' }).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });

      return cardSlider;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    const cardSlider = await this.cardSliderModel.findById(id).catch(err => {
      console.log(err);
      throw new InternalServerErrorException(err);
    });
    if (!cardSlider) throw new InternalServerErrorException("this slider doesn't exist")
    await this.cardModel.deleteMany({
      _id: {
        $in: cardSlider.cards
      }
    }).catch(err => {
      console.log(err);
      throw new InternalServerErrorException(err);
    })

    const shop = await this.shopModel.findById(cardSlider.shop).catch(err => {
      console.log(err);
      throw new InternalServerErrorException(err);

    })
    for (let i = 0; i < shop.containers.length; i++) {
      if (shop.containers[i].containerID === id) {
        shop.containers.splice(i, 1);
        break;
      }
    }
    await shop.save();
    await this.cardSliderModel.findByIdAndDelete(id).catch(err => {
      console.log(err);
      throw new InternalServerErrorException(err);
    })
    return 'cardSlider deleted successfully';
  }
}
