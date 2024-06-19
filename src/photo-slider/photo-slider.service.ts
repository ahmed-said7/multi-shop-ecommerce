import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UpdatePhotoSliderDto } from './dto/update-photo-slider.dto';
import {
  PhotoSlider,
  PhotoSliderDocument,
} from './schemas/photo-slider_schema';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';

import { v2 as cloudinary } from 'cloudinary';

import { join } from 'path';

import { rm } from 'fs/promises';

import { CreatePhotoSliderDto } from './dto/create-photo-slider.dto';

@Injectable()
export class PhotoSliderService {
  constructor(
    @InjectModel(PhotoSlider.name)
    private readonly photoSliderModel: Model<PhotoSliderDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
  ) {}

  private readonly logger = new Logger(PhotoSliderService.name);

  async create(shopId: string, images: Express.Multer.File[]) {
    if (!shopId) {
      throw new BadRequestException('Shop ID must be provided');
    }

    cloudinary.config({
      cloud_name: 'dykmqerdt',
      api_key: '914667443463293',
      api_secret: 'SVBMr1Pd6PCXas9DxnAr_86b11E',
      secure: true,
    });

    const imagesPath = join(__dirname, '..', '..');

    const imageList = images.map((img) => {
      return {
        ...img,
        path: join(imagesPath, img.path),
      };
    });

    try {
      const links: string[] = [];

      for (const img of imageList) {
        const { url } = await cloudinary.uploader.upload(img.path);
        links.push(url);

        await rm(img.path);
      }

      const photoSlider: CreatePhotoSliderDto = {
        shopId,
        isContainer: true,
        isRounded: true,
        photoSlides: links.map((link) => {
          return {
            buttonColor: '',
            buttonLink: '',
            buttonPosition: '',
            buttonText: '',
            buttonTextColor: '',
            photo: link,
            subTitle: '',
            title: '',
            titleAndSubTitleColor: '',
            titleAndSubTitlePostion: '',
          };
        }),
      };

      const slider = await new this.photoSliderModel({
        ...photoSlider,
        shopId,
      }).save();

      return slider;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<PhotoSlider[]> {
    return this.photoSliderModel.find().exec();
  }

  async findOne(id: string): Promise<PhotoSlider | null> {
    return this.photoSliderModel.findById(id).exec();
  }

  async update(
    id: string,
    updatePhotoSliderDto: UpdatePhotoSliderDto,
  ): Promise<PhotoSlider | null> {
    return this.photoSliderModel
      .findByIdAndUpdate(id, updatePhotoSliderDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<string> {
    const photoSlider = await this.photoSliderModel.findById(id);
    if (!photoSlider)
      throw new InternalServerErrorException("this slider doesn't exist");

    const shop = await this.shopModel.findById(photoSlider.shopId);
    for (let i = 0; i < shop.containers.length; i++) {
      if (shop.containers[i].containerID.toString() === id) {
        shop.containers.splice(i, 1);
        break;
      }
    }
    await shop.save();
    await this.photoSliderModel.findByIdAndDelete(id);
    return 'Prouct Slider has been deleted successfully!';
  }
}
