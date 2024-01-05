import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePhotoSliderDto } from './dto/create-photo-slider.dto';
import { UpdatePhotoSliderDto } from './dto/update-photo-slider.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { PhotoSlider, PhotoSliderDocument } from './schemas/photoSlider_schema';

@Injectable()
export class PhotoSliderService {
  constructor(
    @InjectModel(PhotoSlider.name) private photoSliderModel: Model<PhotoSliderDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
  ) { }

  async create(createPhotoSliderDto: CreatePhotoSliderDto) {
    try {
      const photoSlider = await new this.photoSliderModel(CreatePhotoSliderDto).save();
      const shop = await this.shopModel.findById(createPhotoSliderDto.shop);
      shop.containers.push(photoSlider._id);
      await shop.save();
      return photoSlider;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Unexpected error while adding the photo Slider',
      );
    }
  }

  async findAll() {
    try {
      const photoSlider = await this.photoSliderModel.find().catch(err => {
        console.log(err);
        throw new InternalServerErrorException('An unexpected error happened!');
      })
      return photoSlider;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('An unexpected error happened!');
    }
  }

  async findOne(id: string) {
    try {
      const photoSlider = await this.photoSliderModel.findById(id).catch(err => {
        console.log(err);
        throw new InternalServerErrorException('An unexpected error happened while finding the photo slider!');


      });
      return photoSlider;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updatePhotoSliderDto: UpdatePhotoSliderDto) {
    try {
      const photoSlider = await this.photoSliderModel.findByIdAndUpdate(id, updatePhotoSliderDto, {
        new: true,
      }).catch(err => {
        console.log(err);
        throw new InternalServerErrorException('An unexpected error happened while updating the photo slider!');
      });

      return photoSlider;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    const photoSlider = await this.photoSliderModel.findById(id).catch(err => {
      console.log(err);
      throw new InternalServerErrorException('An unexpected error happened while deleting the photoSlider!');
    });
    const shop = await this.shopModel.findById(photoSlider.shop).catch(err => {
      console.log(err);
      throw new InternalServerErrorException('An unexpected error happened while deleting the photoSlider!');

    })
    for (let i = 0; i < shop.containers.length; i++) {
      if (shop.containers[i] === id) {
        shop.containers.splice(i, 1);
        break;
      }
    }
    await shop.save();
    await this.photoSliderModel.findByIdAndDelete(id).catch(err => {
      console.log(err);
      throw new InternalServerErrorException('An unexpected error happened while deleting the photoSlider!');
    })
    return photoSlider;
  }
}
