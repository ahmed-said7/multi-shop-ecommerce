import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreatePhotoSliderDto } from './dto/create-photo-slider.dto';
import { UpdatePhotoSliderDto } from './dto/update-photo-slider.dto';
import {
  PhotoSlider,
  PhotoSliderDocument,
} from './schemas/photo-slider_schema';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';

@Injectable()
export class PhotoSliderService {
  constructor(
    @InjectModel(PhotoSlider.name)
    private readonly photoSliderModel: Model<PhotoSliderDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
  ) {}

  async create(
    shopId: Types.ObjectId,
    createPhotoSliderDto: CreatePhotoSliderDto,
  ): Promise<PhotoSlider> {
    let createdPhotoSlider = await new this.photoSliderModel(
      createPhotoSliderDto,
    ).save();

    const payload = {
      createPhotoSliderDto,
      shopId,
    };
    const Shop = await this.shopModel.findById(payload);

    if (!Shop) {
      throw new NotFoundException("Couldn't find the shop");
    }

    if (Shop?.containers) {
      Shop.containers.push({
        containerID: createdPhotoSlider.id,
        containerType: 'photo-slider',
      });
    } else {
      Shop.$set('containers', [
        {
          containerID: createdPhotoSlider.id,
          containerType: 'photo-slider',
        },
      ]);
    }

    await Shop.save();
    return createdPhotoSlider;
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
