import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import type { Request } from "express";
import mongoose from "mongoose";

import { User, UserDocument, UserRole } from "src/user/schemas/user_schema";
import { Shop, ShopDocument } from "src/shop/schemas/shop_schema";

@Injectable()
export class MerchantGuard implements CanActivate {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: mongoose.Model<UserDocument>,
        @InjectModel(Shop.name)
        private readonly shopModel: mongoose.Model<ShopDocument>,
      ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const userId = request.body?.userId as string;
    const shopId = request.body?.shopId as string;
    const userRole = request.body?.userRole as UserRole;


    if(!userId || !shopId || !userRole) {
        return false;
    }


    const user = await this.userModel.findById(userId);

    if(!user) {
        return false;
    }

    if(user.role !== UserRole.SHOP_OWNER ||  userRole !== UserRole.SHOP_OWNER) {
        return false;
    }



    const shop = await this.shopModel.findById(shopId);

    if(!shop) {
        return false;
    }


    if(user.shopId.toString() !== shop._id?.toString()) {
        return false;
    }



        return true;
    }
    
}