import { IsMongoId, IsOptional } from "class-validator";
import { FindQuery } from "src/common/enums";

export class QueryReviewDto extends FindQuery {
    @IsOptional()
    rating: string|object;
    @IsOptional()
    @IsMongoId()
    user: string;
    @IsOptional()
    @IsMongoId()
    shopId: string;
    @IsOptional()
    @IsMongoId()
    item: string;
};