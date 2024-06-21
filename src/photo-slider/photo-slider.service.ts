import {
  Logger,
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';

import { UpdatePhotoSliderDto } from './dto/update-photo-slider.dto';

import {
  PhotoSlider,
  PhotoSliderDocument,
} from './schemas/photo-slider_schema';

import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';

import { UploadService } from '../upload/upload.service';

@Injectable()
export class PhotoSliderService {
  constructor(
    @InjectModel(PhotoSlider.name)
    private readonly photoSliderModel: Model<PhotoSliderDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    private readonly uploadFileService: UploadService,
  ) {}

  private readonly logger = new Logger(PhotoSliderService.name);

  async create(shopId: string) {
    if (!shopId) {
      throw new BadRequestException('Shop ID must be provided');
    }
  }

  async uploadFilesToView(images: Express.Multer.File[]) {
    const links = await this.uploadFileService.uploadFiles(images);

    return links;
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
