import { Model, MongooseError } from 'mongoose';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateMerchantDto } from './dto/createMerchant.dto';
import { Merchant, MerchantDocument } from './schema/merchant.schema';

type CreateDto = CreateMerchantDto;

@Injectable()
export class MerchantService {
  constructor(
    @InjectModel(Merchant.name)
    private readonly merchantModel: Model<MerchantDocument>,
  ) {}

  private readonly logger = new Logger(MerchantService.name);

  async register(data: CreateDto) {
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
}
