import { Model, Types } from 'mongoose';
import bcrypt from "bcrypt";
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
import { AuthService } from 'src/auth/auth.service';
import { ApiService, IQuery } from 'src/common/filter/api.service';
import { UserRole } from 'src/user/schemas/user_schema';

export type MerchantPayload = {
  userId: string;
  role: UserRole.MERCHANT;
};

@Injectable()
export class MerchantService {
  constructor(
    @InjectModel(Merchant.name)
    private readonly merchantModel: Model<MerchantDocument>,
    @InjectModel(Shop.name)
    private readonly shopModel: Model<ShopDocument>,
    private readonly authService: AuthService,
    private apiService:ApiService<MerchantDocument,IQuery>
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

    const payload: MerchantPayload = {
      userId: merchant._id.toString(),
      role: UserRole.MERCHANT
    };

    const token = await this.authService.getToken(payload);

    return { token };
  }

  async findAll(page:string) {
    const {paginationObj,query}=await this.apiService.
      getAllDocs( this.merchantModel.find(), { page });
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
