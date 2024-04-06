import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateVideoContainerDto } from './dto/create-video-container.dto';
import { UpdateVideoContainerDto } from './dto/update-video-container.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { VideoContainer, VideoContainerDocument } from './schemas/videoContainer-schema';
import { User, UserDocument } from 'src/user/schemas/user_schema';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class VideoContainerService {
  constructor(
    @InjectModel(VideoContainer.name) private videoContainerModel: Model<VideoContainerDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService
  ) { }

  private decodeToken(token: string) {
    return this.jwtService.decode<{ userId: string; username: string }>(token);
  }
  async create(request: any, createVideoContainerDto: CreateVideoContainerDto) {
    try {

      const userEmail = this.decodeToken(request.headers.authorization.split(' ')[1]).username
      const user = await this.userModel.findOne({ email: userEmail }).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err);
      })
      if (!user) throw new NotFoundException('There is no user with this id')
      if (!user.shop) throw new BadRequestException("You don't have a shop")
      const videoContainer = await new this.videoContainerModel(createVideoContainerDto).save().catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });;
      const shop = await this.shopModel.findById(user.shop).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      shop.containers.push({ containerID: videoContainer.id, containerType: 'video container' });
      await shop.save();
      return videoContainer;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  async findAll(request: any) {
    try {
      const userEmail = this.decodeToken(request.headers.authorization.split(' ')[1]).username
      const user = await this.userModel.findOne({ email: userEmail }).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err);
      })
      if (!user) throw new NotFoundException('There is no user with this id')
      if (!user.shop) throw new BadRequestException("You don't have a shop")
      const videoContainer = await this.videoContainerModel.find({ shop: user.shop }).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err);
      })
      return videoContainer;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }


  async findOne(id: string) {
    try {
      const videoContainer = await this.videoContainerModel.findById(id).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err);


      });
      return videoContainer;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateVideoContainerDto: UpdateVideoContainerDto) {
    try {
      const videoContainer = await this.videoContainerModel.findByIdAndUpdate(id, updateVideoContainerDto, {
        new: true,
      }).catch(err => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });

      return videoContainer;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    const videoContainer = await this.videoContainerModel.findById(id).catch(err => {
      console.log(err);
      throw new InternalServerErrorException(err);
    });
    if (!videoContainer) throw new InternalServerErrorException("this slider doesn't exist")

    const shop = await this.shopModel.findById(videoContainer.shop).catch(err => {
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
    await this.videoContainerModel.findByIdAndDelete(id).catch(err => {
      console.log(err);
      throw new InternalServerErrorException(err);
    })
    return 'Video Container deleted successfully';
  }
}
