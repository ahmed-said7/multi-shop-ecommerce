import { IsOptional } from "class-validator";
import { FindQuery } from "src/common/enums";

export class QueryCouponDto extends FindQuery {
    shopId: string;
    @IsOptional()
    endDate: string|object;
    @IsOptional()
    numOfTimes: string|object;
    @IsOptional()
    discountPercentage: string|object;
};