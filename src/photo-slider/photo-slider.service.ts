import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePhotoSliderDto } from './dto/create-photo-slider.dto';
import { UpdatePhotoSliderDto } from './dto/update-photo-slider.dto';
import mongoose, { Model } from 'mongoose';
import { Shop } from 'src/shop/schemas/shop_schema';
import { PhotoSlider, PhotoSliderDocument } from './schemas/photo-slider_schema';
import { PhotoSlide, PhotoSlideDocument } from 'src/photo-slide/schemas/photoSlide_schema';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/schemas/user_schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PhotoSliderService {
  constructor(
    @InjectModel(PhotoSlider.name)
    private readonly photoSliderModel: Model<PhotoSliderDocument>,
    @InjectModel(PhotoSlide.name)
    private readonly photoSlideModel: Model<PhotoSlideDocument>,
    @InjectModel(Shop.name)
    private readonly shopModel: Model<Shop>,
    private readonly jwtService: JwtService,
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<UserDocument>,
  ) { }
  private decodeToken(token: string) {
    return this.jwtService.decode<{ userId: string; username: string }>(token);
  }
  async create(request: any, createPhotoSliderDto: CreatePhotoSliderDto) {
    try {
      const userEmail = this.decodeToken(
        request.headers.authorization.split(' ')[1],
      ).username;
      const user = await this.userModel
        .findOne({ email: userEmail })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      if (!user) throw new NotFoundException('There is no user with this id');
      if (!user.shop) throw new BadRequestException("You don't have a shop");
      createPhotoSliderDto.shop = user.shop;
      const photoSlider = await this.photoSliderModel.create(createPhotoSliderDto).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      const shop = await this.shopModel.findById(photoSlider.shop);
      shop.containers.push({ containerID: photoSlider.id, containerType: 'photo slider' });
      await shop.save();
      return photoSlider;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  async findAll(request: any) {
    try {
      const userEmail = this.decodeToken(
        request.headers.authorization.split(' ')[1],
      ).username;
      const user = await this.userModel
        .findOne({ email: userEmail })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      if (!user) throw new NotFoundException('There is no user with this id');
      if (!user.shop) throw new BadRequestException("You don't have a shop");
      return await this.photoSliderModel.find({ shop: user.shop }).catch(err => {
        console.log(err)
        throw new InternalServerErrorException(err)
      });
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)
    }
  }

  async findOne(id: number) {
    try {
      return await this.photoSliderModel.findById(id).catch(err => {
        console.log(err)
        throw new InternalServerErrorException(err)
      });
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: number, updatePhotoSliderDto: UpdatePhotoSliderDto) {
    try {
      return await this.photoSliderModel.findByIdAndUpdate(id, updatePhotoSliderDto, { new: true }).catch(err => {
        console.log(err)
        throw new InternalServerErrorException(err)
      });
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: string) {
    const photoSlider = await this.photoSliderModel.findById(id).catch(err => {
      console.log(err);
      throw new InternalServerErrorException(err);
    });
    if (!photoSlider) throw new InternalServerErrorException("this slider doesn't exist")
    await this.photoSlideModel.deleteMany({
      _id: {
        $in: photoSlider.photoSlides
      }
    }).catch(err => {
      console.log(err);
      throw new InternalServerErrorException(err);
    })

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
    return 'cardSlider deleted successfully';
  }
}
