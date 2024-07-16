import { Model, Types } from 'mongoose';
import * as bcrypt from "bcrypt";
import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateMerchantDto as CreateDto } from './dto/createMerchant.dto';
import { UpdateMerchantDto as UpdateDto } from './dto/updateMerchant.dto';

import { Merchant, MerchantDocument } from './schema/merchant.schema';

import { Shop, ShopDocument } from '../shop/schemas/shop_schema';
import { ApiService, IQuery } from 'src/common/filter/api.service';
import { jwtTokenService } from 'src/jwt/jwt.service';
import { AllRoles } from 'src/common/enums';
import { QueryMerchantDto } from './dto/query-merchant.dto';

@Injectable()
export class MerchantService {
  constructor(
    @InjectModel(Merchant.name)
    private readonly merchantModel: Model<MerchantDocument>,
    @InjectModel(Shop.name)
    private readonly shopModel: Model<ShopDocument>,
    private jwt:jwtTokenService,
    private apiService:ApiService<MerchantDocument,QueryMerchantDto>
  ) {}

  async create(data: CreateDto) {
      const shop = await this.shopModel.create({
        title: `${data.name}-Shop`,
      });

      data.password=await bcrypt.hash(data.password,10);
      
      const merchant = await this.merchantModel.create({
        ...data,
        shopId: shop?._id
      });

      await this.shopModel.findByIdAndUpdate(shop._id, {
        userID: merchant._id
      });

      return { status:'Merchant Created Successfully'};
  }

  async findOne(id: string) {
      const merchant = await this.merchantModel
        .findById(id).select("-password");
      if( ! merchant ){
        throw new HttpException("merchant not found",400)
      };
      return {merchant};
  }

  async merchantSignIn(email: string, password: string) {
    const merchant=await this.merchantModel.findOne({ email });

    if (!merchant) {
      throw new NotFoundException();
    };

    const valid=await bcrypt.compare(password, merchant.password);
    if(!valid) {
      throw new HttpException("email or password is incorrect",400);
    };


    const { accessToken , refreshToken } = await this.jwt.createTokens({
      userId: merchant._id.toString(),
      role: AllRoles.MERCHANT 
    });

    return { accessToken ,  refreshToken };
  }

  async findAll(filter:QueryMerchantDto) {
    const {paginationObj,query}=await this.apiService.
      getAllDocs( this.merchantModel.find(), filter);
    const merchant=await query;
    return { merchant, paginationObj };
  }

  async update(id: string, data: UpdateDto) {
      await this.merchantModel.findByIdAndUpdate(id, data, { new: true });
      return {status:'Merchant Updated Successfully'};
  }

  async delete(id: string) {
      await this.merchantModel.findByIdAndDelete(id);
      return {status:'Merchant Deleted Successfully'};
  }
}
