import { IsOptional } from "class-validator";

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
};

export enum OrderStatusTypes {
    INPROGRESS = 'in progress',
    DELIVERED = 'delivered',
    CANCELED = 'canceled',
};