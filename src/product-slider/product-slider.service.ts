import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductSliderDto } from './dto/create-product-slider.dto';
import { UpdateProductSliderDto } from './dto/update-product-slider.dto';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProductSlider,
  ProductSliderDocument,
} from './schemas/productSlider_schema';

@Injectable()
export class ProductSliderService {
  constructor(
    @InjectModel(ProductSlider.name)
    private productSliderModel: Model<ProductSliderDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
  ) {}

  async create(createProductSliderDto: CreateProductSliderDto, shop: string) {
    try {
      const payload = {
        ...createProductSliderDto,
        shop,
      };
      const productSlider = await new this.productSliderModel(payload).save();
      const Shop = await this.shopModel.findById(shop);
      Shop.containers.push({
        containerID: productSlider.id,
        containerType: 'product slider',
      });
      await Shop.save();
      return productSlider;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  async findAll(id: string) {
    try {
      const productSlider = await this.productSliderModel
        .find({ shop: id })
        .populate({
          path: 'products',
          model: 'Item',
          select: 'name price description images',
        })
        .populate({
          path: 'shop',
          model: 'Shop',
          select: 'title',
        })
        .exec()
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      return productSlider;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
  async findOne(id: string) {
    try {
      const productSlider = await this.productSliderModel
        .findById(id)
        .populate({
          path: 'products',
          model: 'Item',
          select: 'name price description images',
        })
        .exec()
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });

      return productSlider;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateProductSliderDto: UpdateProductSliderDto) {
    try {
      const productSlider = await this.productSliderModel
        .findByIdAndUpdate(id, updateProductSliderDto, {
          new: true,
        })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });

      return productSlider;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const productSlider = await this.productSliderModel
        .findById(id)
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      if (!productSlider)
        throw new InternalServerErrorException("this slider doesn't exist");
      const shop = await this.shopModel
        .findById(productSlider.shop)
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      for (let i = 0; i < shop.containers.length; i++) {
        if (shop.containers[i].containerID === id) {
          shop.containers.splice(i, 1);
          break;
        }
      }
      await shop.save();
      await this.productSliderModel.findByIdAndDelete(id).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      return 'Prouct Slider has been deleted successfully!';
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
