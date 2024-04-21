import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReviewContainerDto } from './dto/create-reviewContainer.dto';
import { UpdateReviewContainerDto } from './dto/update-reviewContainer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
  ) { }
  async create(createReviewContainerDto: CreateReviewContainerDto) {
    try {
      const reviewContainer = await new this.reviewContainerModel(
        createReviewContainerDto,
      )
        .save()
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });

      const review = await this.reviewModel
        .findById(reviewContainer.review[0])
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      const shop = await this.shopModel.findById(review.shop).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });

      shop.containers.push({
        containerID: reviewContainer.id,
        containerType: 'review container',
      });
      await shop.save();

      return reviewContainer;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  async findAll(shop?: string) {
    try {
      const query = {};
      if (shop != undefined) {
        query['shop'] = shop;
      }
      return await this.reviewContainerModel.find(query).catch((err) => {
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
      return await this.reviewContainerModel.findById(id).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updatereviewContainerDto: UpdateReviewContainerDto) {
    try {
      return await this.reviewContainerModel
        .findByIdAndUpdate(id, updatereviewContainerDto, {
          new: true,
        })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const reviewContainer = await this.reviewContainerModel
        .findById(id)
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      const review = await this.reviewModel
        .findById(reviewContainer.review[0])
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });

      const shop = await this.shopModel.findById(review.shop).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      if (shop) {
        for (let i = 0; i < shop.containers.length; i++) {
          if (shop.containers[i].containerID === id) {
            shop.containers.splice(i, 1);
            break;
          }
        }
        await shop.save();
      }
      const user = await this.userModel.findById(review.user).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      if (user) {
        for (let i = 0; i < user.reviews.length; i++) {
          if (user.reviews[i] === id) {
            user.reviews.splice(i, 1);
            break;
          }
        }
        await user.save();
      }
      await this.reviewContainerModel.findByIdAndDelete(id).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      return 'Review container deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
