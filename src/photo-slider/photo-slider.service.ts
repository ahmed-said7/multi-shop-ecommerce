import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdatePhotoSliderDto } from './dto/update-photo-slider.dto';
import {
  PhotoSlider,
  PhotoSliderDocument,
} from './schemas/photo-slider_schema';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { ApiService } from 'src/common/filter/api.service';
import { QueryPhotoSliderDto } from './dto/query-photo-slider.dto';
import { CreatePhotoSliderDto } from './dto/create-photo-slider.dto';
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Injectable()
export class PhotoSliderService {
  constructor(
    @InjectModel(PhotoSlider.name)
    private readonly photoSliderModel: Model<PhotoSliderDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    private apiService: ApiService<PhotoSliderDocument, QueryPhotoSliderDto>,
    private i18n: CustomI18nService,
  ) {}

  async create(shopId: string, body: CreatePhotoSliderDto) {
    body.shopId = shopId;
    const photoSlider = await this.photoSliderModel.create(body);
    await this.shopModel.findByIdAndUpdate(shopId, {
      $addToSet: {
        containers: { containerId: photoSlider._id, type: 'PhotoSlider' },
      },
    });
    return { photoSlider };
  }

  async findAll(query: QueryPhotoSliderDto) {
    const { query: result, paginationObj } = await this.apiService.getAllDocs(
      this.photoSliderModel.find(),
      query,
    );
    const photoSliders = await result;
    if (photoSliders.length == 0) {
      throw new HttpException(
        this.i18n.translate('test.photoSlider.notFound'),
        400,
      );
    }
    return { photoSliders, pagination: paginationObj };
  }

  async findOne(id: string) {
    const photoSlider = await this.photoSliderModel.findById(id);
    if (!photoSlider)
      throw new InternalServerErrorException(
        this.i18n.translate('test.photoSlider.notFound'),
      );
    return { photoSlider };
  }

  async update(
    id: string,
    shopId: string,
    updatePhotoSliderDto: UpdatePhotoSliderDto,
  ) {
    const photoSlider = await this.photoSliderModel.findOneAndUpdate(
      { shopId, _id: id },
      updatePhotoSliderDto,
      { new: true },
    );
    if (!photoSlider)
      throw new InternalServerErrorException(
        this.i18n.translate('test.photoSlider.notFound'),
      );
    return { photoSlider };
  }

  async remove(id: string, shopId: string) {
    const photoSlider = await this.photoSliderModel.findOneAndDelete({
      shopId,
      _id: id,
    });
    if (!photoSlider)
      throw new InternalServerErrorException(
        this.i18n.translate('test.photoSlider.notFound'),
      );
    await this.shopModel.findByIdAndUpdate(shopId, {
      $pull: { containers: { containerID: id } },
    });
    return { status: this.i18n.translate('test.photoSlider.deleted') };
  }
}
