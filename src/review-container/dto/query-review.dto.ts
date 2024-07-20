import { IsMongoId, IsOptional } from "class-validator";
import { FindQuery } from "src/common/enums";



export class QueryReviewContainerDto extends FindQuery {
    shopId: string;
};