import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

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
import { ApiService } from 'src/common/filter/api.service';
import { QueryReviewContainerDto } from './dto/query-review.dto';
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Injectable()
export class ReviewContainerService {
  constructor(
    @InjectModel(ReviewContainer.name)
    private reviewContainerModel: Model<ReviewContainerDocument>,
    private apiService: ApiService<
      ReviewContainerDocument,
      QueryReviewContainerDto
    >,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private i18n: CustomI18nService,
  ) {}
  private async validateReviews(ids: string[]) {
    const reviews = await this.reviewModel.find({ _id: { $in: ids } });
    if (ids.length != reviews.length) {
      throw new HttpException(this.i18n.translate('test.review.notFound'), 400);
    }
  }
  async create(body: CreateReviewContainerDto, shopId: string) {
    await this.validateReviews(body.reviews);
    const reviewContainer = await this.reviewContainerModel.create({
      ...body,
      shopId,
    });
    await this.shopModel.findByIdAndUpdate(shopId, {
      $addToSet: {
        containers: {
          containerID: reviewContainer.id,
          containerType: 'ReviewContainer',
        },
      },
    });
    return { reviewContainer };
  }

  async findAll(query: QueryReviewContainerDto) {
    const { query: result, paginationObj } = await this.apiService.getAllDocs(
      this.reviewContainerModel.find(),
      query,
    );
    const reviewContainers = await result.populate('reviews');
    if (reviewContainers.length == 0) {
      throw new HttpException(
        this.i18n.translate('test.reviewContainer.notFound'),
        400,
      );
    }
    return { reviewContainers, pagination: paginationObj };
  }

  async findOne(id: string) {
    const reviewContainer = await this.reviewContainerModel
      .findById(id)
      .populate('reviews');
    if (!reviewContainer) {
      throw new HttpException(
        this.i18n.translate('test.reviewContainer.notFound'),
        400,
      );
    }
    return { reviewContainer };
  }

  async update(id: string, shopId: string, body: UpdateReviewContainerDto) {
    if (body.reviews) {
      await this.validateReviews(body.reviews);
    }
    const reviewContainer = await this.reviewContainerModel.findOneAndUpdate(
      { _id: id, shopId },
      body,
      {
        new: true,
      },
    );
    if (!reviewContainer)
      throw new NotFoundException(
        this.i18n.translate('test.reviewContainer.notFound'),
      );
    return { reviewContainer };
  }

  async remove(id: string, shopId: string) {
    const reviewContainer = await this.reviewContainerModel.findOneAndDelete({
      _id: id,
      shopId,
    });
    if (!reviewContainer) {
      throw new NotFoundException(
        this.i18n.translate('test.reviewContainer.notFound'),
      );
    }
    await this.shopModel.findByIdAndUpdate(shopId, {
      $pull: {
        containers: { containerID: id },
      },
    });
    return { reviewContainer };
  }
}
