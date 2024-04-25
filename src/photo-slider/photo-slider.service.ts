import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePhotoSliderDto } from './dto/create-photo-slider.dto';
import { UpdatePhotoSliderDto } from './dto/update-photo-slider.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { PhotoSlider, PhotoSliderDocument } from './schemas/photoSlider_schema';

@Injectable()
export class PhotoSliderService {
  constructor(
    @InjectModel(PhotoSlider.name)
    private photoSliderModel: Model<PhotoSliderDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
  ) {}

  async create(createPhotoSliderDto: CreatePhotoSliderDto) {
    return await this.photoSliderModel
      .create(createPhotoSliderDto)
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
  }

  async createCollection(createPhotoSliderDto: CreatePhotoSliderDto[]) {
    const collection = [];

    try {
      for (const photoInfo of createPhotoSliderDto) {
        const photo = await new this.photoSliderModel(photoInfo).save();
        collection.push(photo);
      }
    } catch (error) {
      const { code, keyPattern } = error;

      const keys = Object.keys(keyPattern).join(',');

      if (code === 11000) {
        const errMsg = `Dublication Error, property(s) 👉 ( ${keys} ) 👈  already exists`;
        throw new BadRequestException(errMsg, {
          cause: 'Duplicatoin In the database',
        });
      }

      throw new BadRequestException(error);
    }

    const { shop, containerName } = createPhotoSliderDto[0];

    await this.shopModel.findByIdAndUpdate(shop, {
      $push: {
        containers: {
          containerID: containerName,
          containerType: 'photo slider',
        },
      },
    });

    return collection;
  }

  async findAll() {
    try {
      return await this.photoSliderModel.find().catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const photoSlider = await this.photoSliderModel
        .findById(id)
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      if (!photoSlider) {
        throw new NotFoundException("this slider doesn't exist");
      }

      return photoSlider;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(newSlider: UpdatePhotoSliderDto[]) {
    try {
      const photoSlider = await this.photoSliderModel.find(
        {
          containerName: newSlider[0].containerName,
        },
        newSlider,
        {
          new: true,
        },
      );

      return photoSlider;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(name: string) {
    const photosSliderList = await this.photoSliderModel.deleteMany({
      containerName: name,
    });

    const shop = await this.shopModel.updateOne(
      {
        'containers.containerID': name,
      },
      {
        $pull: {
          containers: { containerID: name },
        },
      },
      {
        new: true,
      },
    );

    return {
      imagesCount: photosSliderList.deletedCount,
      shopCount: shop.modifiedCount,
    };
  }
}
