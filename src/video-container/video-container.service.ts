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
    userId: string,
    createVideoContainerDto: CreateVideoContainerDto,
  ) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('There is no user with this id');
    }

    if (!user.shop) {
      throw new BadRequestException("You don't have a shop");
    }
    const videoContainer = await new this.videoContainerModel(
      createVideoContainerDto,
    ).save();

    const shop = await this.shopModel.findById(
      createVideoContainerDto?.['shop'],
    );

    if (!shop) {
      throw new NotFoundException("Couldn't find the shop");
    }

    if (shop?.containers) {
      shop.containers.push({
        containerID: videoContainer.id,
        containerType: 'video container',
      });
    } else {
      shop.$set('containers', [
        {
          containerID: videoContainer.id,
          containerType: 'video container',
        },
      ]);
    }

    await shop.save();
    return videoContainer;
  }

  async findAll(userId: string) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException('There is no user with this id');
      }
      if (!user.shop) {
        throw new BadRequestException("You don't have a shop");
      }

      return await this.videoContainerModel.find({ shop: user.shop });
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

    const shop = await this.shopModel.findById(videoContainer.shop);

    for (let i = 0; i < shop.containers.length; i++) {
      if (shop.containers[i].containerID === id) {
        shop.containers.splice(i, 1);
        break;
      }
    }
    await shop.save();
    await this.videoContainerModel.findByIdAndDelete(id);

    return 'Video Container deleted successfully';
  }
}
