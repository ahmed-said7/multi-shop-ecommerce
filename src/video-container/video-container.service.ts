import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVideoContainerDto } from './dto/create-video-container.dto';
import { UpdateVideoContainerDto } from './dto/update-video-container.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import {
  VideoContainer,
  VideoContainerDocument,
} from './schemas/videoContainer-schema';
import { Types } from 'mongoose';
import { ApiService } from 'src/common/filter/api.service';
import { QueryVideoContainerDto } from './dto/query-video-container.dto';
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Injectable()
export class VideoContainerService {
  constructor(
    private apiService: ApiService<
      VideoContainerDocument,
      QueryVideoContainerDto
    >,
    @InjectModel(VideoContainer.name)
    private videoContainerModel: Model<VideoContainerDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    private i18n: CustomI18nService,
  ) {}

  async create(shopId: string, body: CreateVideoContainerDto) {
    const videoContainer = await this.videoContainerModel.create({
      ...body,
      shopId,
    });

    await this.shopModel.findByIdAndUpdate(shopId, {
      $addToSet: {
        containers: {
          containerID: videoContainer._id,
          containerType: 'VideoContainer',
        },
      },
    });
    return { videoContainer };
  }

  async findAll(query: QueryVideoContainerDto) {
    console.log(query);
    const { query: result, paginationObj } = await this.apiService.getAllDocs(
      this.videoContainerModel.find(),
      query,
    );
    const videos = await result;
    if (videos.length == 0) {
      throw new HttpException(
        this.i18n.translate('test.videoContainer.notFound'),
        400,
      );
    }
    return { videos, pagination: paginationObj };
  }

  async findOne(id: string) {
    const video = await this.videoContainerModel.findById(id);
    if (!video) {
      throw new NotFoundException(
        this.i18n.translate('test.videoContainer.notFound'),
      );
    }
    return { video };
  }

  async update(id: string, shopId: string, body: UpdateVideoContainerDto) {
    const video = await this.videoContainerModel.findOneAndUpdate(
      { _id: id, shopId },
      body,
      {
        new: true,
      },
    );
    if (!video) {
      throw new NotFoundException(
        this.i18n.translate('test.videoContainer.notFound'),
      );
    }
    return { video };
  }

  async remove(id: string, shopId: string) {
    const video = await this.videoContainerModel.findOneAndDelete({
      _id: id,
      shopId,
    });
    if (!video) {
      throw new NotFoundException(
        this.i18n.translate('test.videoContainer.notFound'),
      );
    }

    await this.shopModel.findByIdAndUpdate(shopId, {
      $pull: {
        containers: {
          containerID: id,
        },
      },
    });
    return { status: this.i18n.translate('test.videoContainer.deleted') };
  }
}
