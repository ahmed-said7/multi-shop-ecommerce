import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Request } from 'express';
import mongoose from 'mongoose';
import { Coupon } from 'src/coupon/schemas/coupon.schema';
import { Item, ItemDocument } from 'src/item/schemas/item-schema';
import { Order } from 'src/order/schemas/order_schema';
import { PhotoSlider } from 'src/photo-slider/schemas/photo-slider_schema';
import { ProductSlider } from 'src/product-slider/schemas/productSlider_schema';
import { Cart } from 'src/cart/schemas/cart.schema';
import { Category } from 'src/category/schemas/category_schema';
import { VideoContainer } from 'src/video-container/schemas/videoContainer-schema';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import {
  ReviewContainer,
  ReviewContainerDocument,
} from 'src/review-container/schemas/reviewContainer_schema';

@Injectable()
export class MerchantGuard implements CanActivate {
  constructor(
    @InjectModel(Shop.name)
    private readonly shopModel: mongoose.Model<ShopDocument>,
    @InjectModel(Coupon.name)
    private readonly couponModel: mongoose.Model<Coupon>,
    @InjectModel(Item.name)
    private readonly itemModel: mongoose.Model<ItemDocument>,
    @InjectModel(Order.name) private readonly orderModel: mongoose.Model<Order>,
    @InjectModel(PhotoSlider.name)
    private readonly photoSliderModel: mongoose.Model<PhotoSlider>,
    @InjectModel(ProductSlider.name)
    private readonly productSliderModel: mongoose.Model<ProductSlider>,
    @InjectModel(Cart.name) private readonly cartModel: mongoose.Model<Cart>,
    @InjectModel(Category.name)
    private readonly categoryModel: mongoose.Model<Category>,
    @InjectModel(VideoContainer.name)
    private readonly videoContainerModel: mongoose.Model<VideoContainer>,
    @InjectModel(ReviewContainer.name)
    private reviewContainerModel: mongoose.Model<ReviewContainerDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const shopId = request.body?.shopId as string;
    if (!shopId) {
      throw new ForbiddenException('shopId not provided');
    }

    const id = request.params.id as string;
    if (!id) {
      throw new ForbiddenException('id not provided');
    }

    const path = request.route.path as string;
    if (!path) {
      throw new ForbiddenException('path not provided');
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id format');
    }

    // Adjusted regex pattern to handle paths with parameters
    const routePattern = /^\/([^\/]+)(\/|$)/;
    const match = path.match(routePattern);
    const routeName = match ? match[1] : null;

    if (!routeName) {
      throw new ForbiddenException('routeName not determined');
    }

    try {
      let model;

      switch (routeName) {
        case 'shop':
          model = this.shopModel;
          break;
        case 'coupon':
          model = this.couponModel;
          break;
        case 'cart':
          model = this.cartModel;
          break;
        case 'category':
          model = this.categoryModel;
          break;
        case 'item':
          model = this.itemModel;
          break;
        case 'order':
          model = this.orderModel;
          break;
        case 'photo-slider':
          model = this.photoSliderModel;
          break;
        case 'product-slider':
          model = this.productSliderModel;
          break;
        case 'video-container':
          model = this.videoContainerModel;
          break;
        case 'review-container':
          model = this.reviewContainerModel;
          break;
        default:
          throw new NotFoundException(`Unsupported route: ${routeName}`);
      }

      const thing = await model.findById(id);
      if (!thing) {
        throw new NotFoundException(`No ${routeName} found with id ${id}`);
      }

      if (routeName !== 'shop') {
        const documentShopId =
          thing.shopId?.toString() || thing.shop?.toString();

        if (documentShopId !== shopId.toString()) {
          throw new ForbiddenException(
            `shopId mismatch. Expected ${documentShopId}, got ${shopId}`,
          );
        }
      }

      return true;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new ForbiddenException(
        'An error occurred while checking permissions',
      );
    }
  }
}
