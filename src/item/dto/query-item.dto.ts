import { IsMongoId, IsOptional } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";
import { FindQuery } from "src/common/enums";

export class QueryItemDto extends FindQuery {
    @IsOptional()
    price: string|object;
    @IsOptional()
    amount: string|object;
    @IsOptional()
    @IsMongoId({ message: i18nValidationMessage("validation.item.category.isMongoId") })
    category: string;
    @IsOptional()
    soldTimes?: string|object;
    shopId:string;
};