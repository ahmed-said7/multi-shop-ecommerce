import { HttpException } from "@nestjs/common";
import { IsOptional } from "class-validator";
import { Request } from "express";
import multer, { memoryStorage } from "multer";

export enum GENDER_STATUS { 
    MALE="male",
    FEMALE="female"
};

export enum RequestType {
    SHOP = 'Shop',
    DESIGN = 'Design',
};

export interface IAuthUser {
    _id: string;
    role:string;
    shopId?:string;
}
export class FindQuery {
    @IsOptional()
    page?:string;
    @IsOptional()
    sort?:string;
    @IsOptional()
    select?:string;
    @IsOptional()
    limit?:string;
    @IsOptional()
    keyword?:string;
    @IsOptional()
    updatedAt?:string|object;
    @IsOptional()
    createdAt?:string|object;
};

export enum AllRoles {
    ADMIN = 'admin',
    USER = 'user',
    MERCHANT = 'merchant',
};

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
};

export enum UserExperienceType {
    STORE = 'store',
    SOCIALMEDIA = 'social_media',
}

export enum ReadyOption {
    PRODUCTS = 'products',
    DESIGN = 'design',
    STATEMENTS = 'statements',
    PAYMENTS = 'payments',
    LOGISTICS = 'logistics',
    DIGITAL_MARKETING = 'digital_marketing',
};

export enum OrderStatusTypes {
    INPROGRESS = 'in progress',
    DELIVERED = 'delivered',
    CANCELED = 'canceled',
};

const fileFilter=function(type:string){
    return function(req:Request,file:Express.Multer.File,cb:multer.FileFilterCallback){
        const valid =file.mimetype.startsWith(type);
        if ( valid ) {
            return cb(null, true);
        } else {
            return cb(new HttpException("Invalid file", 400));
        };
    }
};


export enum ThemeType {
    MOBILE = 'mobile',
    WEB = 'web',
};

export enum reportTypes {
    monthlySales="monthlySales",
    itemSales="itemSales",
    itemRatings="itemRatings",
    orderMetrics="orderMetrics",
    mostProfitable="mostProfitable"
}

export const optsImg={ fileFilter:fileFilter("image"),storage:memoryStorage() };
export const optsVideo={ fileFilter:fileFilter("video"),storage:memoryStorage() };
