import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review_schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) { }
  async create(createReviewDto: CreateReviewDto) {
    try {
      const review = new this.reviewModel(createReviewDto).save().catch(err => {
        console.log(err)
        throw new InternalServerErrorException(err)
      })
      return review;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error)
    }
  }

  async findAll(user?: string, shop?: string, item?: string) {
    try {
      const query = { user, shop, item }
      for (let key in query) {
        if (!query[key]) delete query[key]
      }
      const reviews = await this.reviewModel.find({ ...query }).exec().catch(err => {
        console.log(err)
        throw new InternalServerErrorException(err)
      });
      return reviews;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }

  }

  async findOne(id: string) {
    try {
      const review = await this.reviewModel.findById(id).catch(err => {
        console.log(err)
        throw new InternalServerErrorException(err)
      })
      return review
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    try {
      const review = await this.reviewModel.findByIdAndUpdate(id, updateReviewDto).catch(err => {
        console.log(err)
        throw new InternalServerErrorException(err)
      })
      return review
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: string, userId: string) {
    try {
      const review = await this.reviewModel.findById(id).catch(err => {
        console.log(err)
        throw new InternalServerErrorException(err)
      })

      if (review.shop == userId) throw new BadRequestException('You cant delete reviews from your own shop!')

      if (review.user != userId) throw new BadRequestException('You cant delete this review!')

      await this.reviewModel.deleteOne({ id }).catch(err => {
        console.log(err)
        throw new InternalServerErrorException(err)
      })

      return "review has been deleted successfully!"

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)
    }
  }
}
