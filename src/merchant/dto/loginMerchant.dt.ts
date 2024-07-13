import { IsNotEmpty, IsString } from "class-validator";

export class LoginMerchantDto {
    @IsNotEmpty()
    @IsString()
    email: string;
    @IsNotEmpty()
    @IsString()
    password: string;
};