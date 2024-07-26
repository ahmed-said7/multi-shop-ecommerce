import { IsNotEmpty, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class LoginMerchantDto {
    // @IsNotEmpty({ message:i18nValidationMessage("validation.merchant.email.isNotEmpty") })
    @IsString({ message:i18nValidationMessage("validation.merchant.email.isString") })
    email: string;
    // @IsNotEmpty({ message:i18nValidationMessage("validation.merchant.password.isNotEmpty") })
    @IsString({ message:i18nValidationMessage("validation.merchant.password.isString") })
    password: string;
};