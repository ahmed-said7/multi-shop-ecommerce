import { IsMongoId, IsOptional } from "class-validator";
import { Types } from "mongoose";
import { FindQuery } from "src/common/enums";

export class QueryCategoryDto extends FindQuery {
    // @IsOptional()
    // @IsMongoId()
    shopId:Types.ObjectId;
};