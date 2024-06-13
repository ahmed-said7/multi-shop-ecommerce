import { Document, Model, MongooseError, Types } from 'mongoose';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateMerchantDto as CreateDto } from './dto/createMerchant.dto';
import { UpdateMerchantDto as UpdateDto } from './dto/updateMerchant.dto';

import { Merchant, MerchantDocument } from './schema/merchant.schema';

import { Shop, ShopDocument } from '../shop/schemas/shop_schema';
import { AuthService } from 'src/auth/auth.service';

type DocType = Document<
  unknown,
  any,
  Document<unknown, any, Merchant> & Merchant & { _id: Types.ObjectId }
> &
  Document<unknown, any, Merchant> &
  Merchant & { _id: Types.ObjectId } & Required<{ _id: Types.ObjectId }>;

@Injectable()
export class MerchantService {
  constructor(
    @InjectModel(Merchant.name)
    private readonly merchantModel: Model<MerchantDocument>,
    @InjectModel(Shop.name)
    private readonly shopModel: Model<ShopDocument>,
    private readonly authService: AuthService,
  ) {}

  private readonly logger = new Logger(MerchantService.name);

  async create(data: CreateDto) {
    try {
      const shop = await new this.shopModel({
        title: `${data.name}-Shop`,
      }).save();

      this.logger.verbose({ shop, shopId: shop._id });

      const merchant = await new this.merchantModel({
        ...data,
        shopId: shop?._id || shop.id,
      }).save();

      await this.shopModel.findByIdAndUpdate(shop._id, {
        userID: merchant._id,
      });

      this.logger.log(merchant);

      return 'Merchant Created Successfully';
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError) {
        throw new BadRequestException(`${error.name}: ${error.message}`);
      }

      throw new InternalServerErrorException("Can't Create Merchant");
    }
  }

  async findOne(id: string) {
    try {
      const merchant = await this.merchantModel.findById(id);

      delete merchant.password;

      return merchant;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError) {
        throw new BadRequestException(`${error.name}: ${error.message}`);
      }

      throw new InternalServerErrorException("Can't Create Merchant");
    }
  }

  async merchantSignIn(email: string, password: string) {
    let merchant: DocType;

    try {
      merchant = await this.merchantModel.findOne({ email, password });
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException("Can't generate code");
    }

    if (!merchant) {
      throw new NotFoundException();
    }

    const payload = {
      id: merchant._id,
      email: merchant.email,
      name: merchant.name,
      role: merchant.role,
      gender: merchant.gender,
    };

    const token = await this.authService.getToken(payload);

    return token;
  }

  async findAll(page: number = 0) {
    try {
      return await this.merchantModel
        .find()
        .skip(page * 10)
        .limit(10);
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError) {
        throw new BadRequestException(`${error.name}: ${error.message}`);
      }

      throw new InternalServerErrorException("Can't Create Merchant");
    }
  }

  async update(id: string, data: UpdateDto) {
    delete data.shop;

    try {
      await this.merchantModel.findByIdAndUpdate(id, data, { new: true });

      return 'Merchant Updated Successfully';
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError) {
        throw new BadRequestException(`${error.name}: ${error.message}`);
      }

      throw new InternalServerErrorException("Can't Update Merchant");
    }
  }

  async delete(id: string) {
    try {
      await this.merchantModel.findByIdAndDelete(id);

      return 'Merchant Deleted Successfully';
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError) {
        throw new BadRequestException(`${error.name}: ${error.message}`);
      }

      throw new InternalServerErrorException("Can't Delete Merchant");
    }
  }
}
