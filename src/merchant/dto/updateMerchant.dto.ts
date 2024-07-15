import { Transform } from 'class-transformer';
import { IsDate, IsDateString, IsEmail, IsEnum, IsMobilePhone, IsOptional, IsString } from 'class-validator';
import { GENDER_STATUS } from 'src/common/enums';

export class UpdateMerchantDto  {
    @IsOptional()
    @IsString()
    name: string;
    @IsOptional()
    @IsString()
    @IsEmail()
    email: string;
    @IsOptional()
    @IsString()
    @IsMobilePhone()
    phone: string;
    @IsOptional()
    @IsEnum(GENDER_STATUS)
    gender: GENDER_STATUS;

    @IsOptional()
    @IsDateString()
    birthday: Date;
}
