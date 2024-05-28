import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVideoContainerDto } from './dto/create-video-container.dto';
import { UpdateVideoContainerDto } from './dto/update-video-container.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import {
  VideoContainer,
  VideoContainerDocument,
} from './schemas/videoContainer-schema';
import { User, UserDocument } from 'src/user/schemas/user_schema';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

@Injectable()
export class VideoContainerService {
  constructor(
    @InjectModel(VideoContainer.name)
    private videoContainerModel: Model<VideoContainerDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  private decodeToken(token: string) {
    return this.jwtService.decode<{ userId: string; username: string }>(token);
  }
  async create(
    shop: Types.ObjectId,
    createVideoContainerDto: CreateVideoContainerDto,
  ) {
    const payload = {
      ...createVideoContainerDto,
      shop,
    };

    const videoContainer = await new this.videoContainerModel(payload).save();

    const Shop = await this.shopModel.findById(shop);

    if (!Shop) {
      throw new NotFoundException("Couldn't find the shop");
    }

    if (Shop?.containers) {
      Shop.containers.push({
        containerID: videoContainer.id,
        containerType: 'VideoContainer',
      });
    } else {
      Shop.$set('containers', [
        {
          containerID: videoContainer.id,
          containerType: 'VideoContainer',
        },
      ]);
    }

    await Shop.save();
    return videoContainer;
  }

  async findAll(id: Types.ObjectId) {
    try {
      return await this.videoContainerModel.find({ shopId: id });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.videoContainerModel.findById(id).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateVideoContainerDto: UpdateVideoContainerDto) {
    try {
      return await this.videoContainerModel.findByIdAndUpdate(
        id,
        updateVideoContainerDto,
        {
          new: true,
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    const videoContainer = await this.videoContainerModel.findById(id);

    if (!videoContainer) {
      throw new InternalServerErrorException("this slider doesn't exist");
    }

    const shop = await this.shopModel.findById(videoContainer.shopId);

    for (let i = 0; i < shop.containers.length; i++) {
      if (shop.containers[i].containerID.toString() === id) {
        shop.containers.splice(i, 1);
        break;
      }
    }
    await shop.save();
    await this.videoContainerModel.findByIdAndDelete(id);

    return 'Video Container deleted successfully';
  }
}
