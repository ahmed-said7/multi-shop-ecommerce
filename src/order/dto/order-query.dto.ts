import { IsMongoId, IsOptional } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";
import { FindQuery } from "src/common/enums";

export class QueryOrderDto extends FindQuery {
    @IsOptional()
    delivered: string;
    @IsOptional()
    paid: string;
    @IsOptional()
    status: string;
    @IsOptional()
    @IsMongoId({ message:i18nValidationMessage("validation.order.shopId.isMongoId") })
    shopId: string;
    @IsOptional()
    @IsMongoId({ message:i18nValidationMessage("validation.order.userId.isMongoId") })
    userId: string;
    @IsOptional()
    priceTotal?: number|object;
};