import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewContainerDto } from './dto/create-reviewContainer.dto';
import { UpdateReviewContainerDto } from './dto/update-reviewContainer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { User, UserDocument } from 'src/user/schemas/user_schema';
import {
  ReviewContainer,
  ReviewContainerDocument,
} from './schemas/reviewContainer_schema';
import { Review, ReviewDocument } from 'src/review/schemas/review_schema';

@Injectable()
export class ReviewContainerService {
  constructor(
    @InjectModel(ReviewContainer.name)
    private reviewContainerModel: Model<ReviewContainerDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}
  async create(
    createReviewContainerDto: CreateReviewContainerDto,
    shopId: string,
  ) {
    try {
      const payload = {
        ...createReviewContainerDto,
        shopId,
      };
      const reviewContainer = await new this.reviewContainerModel(
        payload,
      ).save();

      const shop = await this.shopModel.findById(shopId);

      if (shop?.containers) {
        shop.containers.push({
          containerID: reviewContainer.id,
          containerType: 'ReviewContainer',
        });
      } else {
        shop.$set('containers', [
          {
            containerID: reviewContainer.id,
            containerType: 'ReviewContainer',
          },
        ]);
      }

      await shop.save();

      return reviewContainer;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  async findAll(id: string) {
    try {
      return await this.reviewContainerModel.find({ shopId: id });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const reviewContainer = await this.reviewContainerModel.findById(id);
      if (!reviewContainer) {
        throw new NotFoundException('this review container not found');
      }
      return await this.reviewContainerModel.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async update(id: string, updatereviewContainerDto: UpdateReviewContainerDto) {
    try {
      const reviewContainer = await this.reviewContainerModel.findByIdAndUpdate(
        id,
        updatereviewContainerDto,
        {
          new: true,
        },
      );
      if (!reviewContainer)
        throw new NotFoundException("This container doesn't exist");
      return reviewContainer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async remove(id: string, shopId) {
    try {
      const reviewContainer = await this.reviewContainerModel.findById(id);
      if (!reviewContainer) {
        throw new NotFoundException('this review container not found');
      }
      const shop = await this.shopModel.findById(shopId);

      if (shop) {
        for (let i = 0; i < shop.containers.length; i++) {
          if (shop.containers[i].containerID.toString() === id) {
            shop.containers.splice(i, 1);
            break;
          }
        }
        await shop.save();
      }
      await this.reviewContainerModel.findByIdAndDelete(id);
      return 'Review container deleted successfully';
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
