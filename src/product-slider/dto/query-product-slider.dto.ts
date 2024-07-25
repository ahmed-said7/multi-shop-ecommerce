import {  IsMongoId, IsOptional } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";
import { FindQuery } from "src/common/enums";

export class QueryProductSliderDto extends FindQuery {
    @IsOptional()
    @IsMongoId({message:i18nValidationMessage("validation.productSlider.shopId.isMongoId")})
    shopId: string;
    @IsOptional()
    isSlider:string;
};