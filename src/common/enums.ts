export enum GENDER_STATUS { 
    MALE="male",
    FEMALE="female"
};

export interface IAuthUser {
    _id: string;
    role:string;
    shopId?:string;
}