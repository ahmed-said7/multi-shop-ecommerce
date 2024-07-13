import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsMobilePhone, IsOptional, IsString } from 'class-validator';
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
    @Transform( ({ value }) => {
        if( value ){
            return new Date(value);
        };
    })
    @IsDate()
    birthday: Date;
}
