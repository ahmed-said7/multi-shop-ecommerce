import { IsMongoId, IsOptional } from "class-validator";
import { FindQuery } from "src/common/enums";

export class QueryOrderDto extends FindQuery {
    @IsOptional()
    delivered: boolean;
    @IsOptional()
    paid: boolean;
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