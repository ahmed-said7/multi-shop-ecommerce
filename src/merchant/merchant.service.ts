import { Model, MongooseError } from 'mongoose';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateMerchantDto as CreateDto } from './dto/createMerchant.dto';
import { UpdateMerchantDto as UpdateDto } from './dto/updateMerchant.dto';

import { Merchant, MerchantDocument } from './schema/merchant.schema';

@Injectable()
export class MerchantService {
  constructor(
    @InjectModel(Merchant.name)
    private readonly merchantModel: Model<MerchantDocument>,
  ) {}

  private readonly logger = new Logger(MerchantService.name);

  async create(data: CreateDto) {
    try {
      await new this.merchantModel(data).save();

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
      return await this.merchantModel.findById(id);
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError) {
        throw new BadRequestException(`${error.name}: ${error.message}`);
      }

      throw new InternalServerErrorException("Can't Create Merchant");
    }
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
