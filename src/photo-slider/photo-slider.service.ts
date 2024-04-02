import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

      const photoSlider = await this.photoSliderModel.create(createPhotoSliderDto).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      const shop = await this.shopModel.findById(createPhotoSliderDto.shop);
      shop.containers.push({ containerID: photoSlider.id, containerType: 'photo slider' });
      await shop.save();

      return photoSlider
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
        throw new InternalServerErrorException(err);
      })
      return photoSlider;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const photoSlider = await this.photoSliderModel.findById(id).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err);


      });
      if (!photoSlider) throw new NotFoundException("this slider doesn't exist")

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
        throw new InternalServerErrorException(err);
      });
      console.log(photoSlider);


      return photoSlider;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    const photoSlider = await this.photoSliderModel.findById(id).catch(err => {
      console.log(err);
      throw new InternalServerErrorException(err);
    });
    if (!photoSlider) throw new InternalServerErrorException("this slider doesn't exist")
    const shop = await this.shopModel.findById(photoSlider.shop).catch(err => {
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
    await this.photoSliderModel.findByIdAndDelete(id).catch(err => {
      console.log(err);
      throw new InternalServerErrorException(err);
    })
    return photoSlider;
  }
}
