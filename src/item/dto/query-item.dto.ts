import { IsMongoId, IsOptional } from "class-validator";
import { FindQuery } from "src/common/enums";

export class QueryItemDto extends FindQuery {
    @IsOptional()
    price: string|object;
    @IsOptional()
    amount: string|object;
    @IsOptional()
    @IsMongoId()
    category: string;
    @IsOptional()
    @IsMongoId()
    shopId: string;
    @IsOptional()
    soldTimes?: string|object;
};