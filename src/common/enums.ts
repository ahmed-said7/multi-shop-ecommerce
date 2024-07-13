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