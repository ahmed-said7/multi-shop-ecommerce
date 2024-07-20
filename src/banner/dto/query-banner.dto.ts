import { IsMongoId, IsOptional } from "class-validator";
import { FindQuery } from "src/common/enums";

export class QueryBannerDto extends FindQuery {
    shopId?:string;
}