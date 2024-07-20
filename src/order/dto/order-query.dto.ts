import { IsMongoId, IsOptional } from "class-validator";
import { FindQuery } from "src/common/enums";

export class QueryOrderDto extends FindQuery {
    @IsOptional()
    delivered: string;
    @IsOptional()
    paid: string;
    @IsOptional()
    status: string;
    @IsOptional()
    @IsMongoId()
    shopId: string;
    @IsOptional()
    @IsMongoId()
    userId: string;
    @IsOptional()
    priceTotal?: number|object;
};