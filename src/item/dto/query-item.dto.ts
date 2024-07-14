import { IsMongoId, IsOptional } from "class-validator";
import { FindQuery } from "src/common/enums";

export class QueryItemDto extends FindQuery {
    @IsOptional()
    price: number|object;
    @IsOptional()
    amount: number|object;
    @IsOptional()
    @IsMongoId()
    category: string;
    @IsOptional()
    @IsMongoId()
    shopId: string;
    @IsOptional()
    soldTimes?: number|object;
};