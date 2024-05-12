import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePhotoSlideDto } from './dto/create-photo-slide.dto';
import { UpdatePhotoSlideDto } from './dto/update-photo-slide.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { PhotoSlide, PhotoSlideDocument } from './schemas/photoSlide_schema';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/user/schemas/user_schema';

@Injectable()
export class PhotoSlideService {
  constructor(
    @InjectModel(PhotoSlide.name)
    private photoSlideModel: Model<PhotoSlideDocument>,
  ) { }

  async create(createPhotoSlideDto: CreatePhotoSlideDto) {

    const photoSlide = new this.photoSlideModel(createPhotoSlideDto);
    return await photoSlide.save().catch(err => {
      console.log(err);
      throw new InternalServerErrorException(err);
    });
  }

  // async createCollection(createPhotoSlideDto: CreatePhotoSlideDto[]) {
  //   const collection = [];

  //   try {
  //     for (const photoInfo of createPhotoSlideDto) {
  //       const photo = await new this.photoSlideModel(photoInfo).save();
  //       collection.push(photo);
  //     }
  //   } catch (error) {
  //     const { code, keyPattern } = error;

  //     const keys = Object.keys(keyPattern).join(',');

  //     if (code === 11000) {
  //       const errMsg = `Dublication Error, property(s) 👉 ( ${keys} ) 👈  already exists`;
  //       throw new BadRequestException(errMsg, {
  //         cause: 'Duplicatoin In the database',
  //       });
  //     }

  //     throw new BadRequestException(error);
  //   }

  //   const { shop, containerName } = createPhotoSlideDto[0];

  //   await this.shopModel.findByIdAndUpdate(shop, {
  //     $push: {
  //       containers: {
  //         containerID: containerName,
  //         containerType: 'photo slider',
  //       },
  //     },
  //   });

  //   return collection;
  // }

  async findAll(photoSlider: mongoose.Types.ObjectId) {
    try {

      return await this.photoSlideModel.find({ photoSlider: photoSlider }).catch((err) => {
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
      const photoSlider = await this.photoSlideModel
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

  async update(id: mongoose.Types.ObjectId, updatePhotoSlideDto: UpdatePhotoSlideDto) {
    try {
      const photoSlide = await this.photoSlideModel.findByIdAndUpdate(id, updatePhotoSlideDto, {
        new: true,
      });

      return photoSlide;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async updatePhoto(id:string, photo: string) {
    try {
      const photoSlide = await this.photoSlideModel.findByIdAndUpdate(id, {photo}, {
        new: true,
      });

      return photoSlide;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  // async update(newSlider: UpdatePhotoSlideDto[]) {
  //   try {
  //     const photoSlider = await this.photoSlideModel.find(
  //       {
  //         containerName: newSlider[0].containerName,
  //       },
  //       newSlider,
  //       {
  //         new: true,
  //       },
  //     );

  //       return photoSlider;
  //     } catch (error) {
  //   throw new InternalServerErrorException(error);
  // }
  //   }

  async remove(id: mongoose.Types.ObjectId) {
    try {
      const photoSlide = await this.photoSlideModel.findById(id);
      const photoSlider = await this.photoSlideModel.findById(photoSlide.id);
      if (!photoSlider) throw new NotFoundException('This slider doesnt exist');


      return photoSlide;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
