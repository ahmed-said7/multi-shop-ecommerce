import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import type { Request } from "express";
import mongoose from "mongoose";

import { Coupon } from "src/coupon/schemas/coupon.schema";
import { Item, ItemDocument } from "src/item/schemas/item-schema";
import { Order } from "src/order/schemas/order_schema";
import { PhotoSlider } from "src/photo-slider/schemas/photo-slider_schema";
import { ProductSlider } from "src/product-slider/schemas/productSlider_schema";
import { Cart } from "src/cart/schemas/cart.schema";
import { Category } from "src/category/schemas/category_schema";
import { VideoContainer } from "src/video-container/schemas/videoContainer-schema";

@Injectable()
export class MerchantGuard implements CanActivate {
    constructor(
        @InjectModel(Coupon.name)
        private readonly couponModel: mongoose.Model<Coupon>,
        @InjectModel(Item.name)
        private readonly itemModel: mongoose.Model<ItemDocument>,
        @InjectModel(Order.name)
        private readonly orderModel: mongoose.Model<Order>,
        @InjectModel(PhotoSlider.name)
        private readonly photoSliderModel: mongoose.Model<PhotoSlider>,
        @InjectModel(ProductSlider.name)
        private readonly productSliderModel: mongoose.Model<ProductSlider>,
        @InjectModel(Cart.name)
        private readonly cartModel: mongoose.Model<Cart>,
        @InjectModel(Category.name)
        private readonly categoryModel: mongoose.Model<Category>,
        @InjectModel(VideoContainer.name)
        private readonly videoContainerModel: mongoose.Model<VideoContainer>,
      ) {}

      

    async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const shopId = request.body?.shopId as string;

    if(!shopId) {
        return false;
    }


    const id = request.params.id as string;

    if(!id) {
        return false;
    }

    const path = request.route.path as string;

    if(!path ) {
        return false;
    }

    const routePattern = /\/[a-z]*\//gi;

    const routeName = path.match(routePattern)?.[0]?.replaceAll('/', '');

    console.log({routeName, id});


    if(!routeName) {
        return false;
    }

    
    if(routeName === "shop") {
        return shopId === id;
    }


    if(routeName === "coupon") {
        const thing = await this.couponModel.findById(id);
        return thing.shopId.toString() === shopId.toString();
    }


    if(routeName === "cart") {
        const thing = await this.cartModel.findById(id);
        return thing.shopId.toString() === shopId.toString();
    }

    if(routeName === "category") {
        const thing = await this.categoryModel.findById(id);
        return thing.shopId.toString() === shopId.toString();
    }

    if(routeName === "item") {
        const thing = await this.itemModel.findById(id);
        return thing.shopId.toString() === shopId.toString();
    }

    if(routeName === "order") {
        const thing = await this.orderModel.findById(id);
        return thing.shopId.toString() === shopId.toString();
    }

    if(routeName === "photo-slider") {
        const thing = await this.photoSliderModel.findById(id);
        return thing.shopId.toString() === shopId.toString();
    }

    if(routeName === "product-slider") {
        const thing = await this.productSliderModel.findById(id);
        return thing.shop.toString() === shopId.toString();
    }


    if(routeName === "video-container") {
        const thing = await this.videoContainerModel.findById(id);
        return thing.shopId.toString() === shopId.toString();
    }



        return true;
    }
    
}