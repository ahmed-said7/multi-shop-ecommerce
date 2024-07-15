import { IsMongoId, IsOptional } from "class-validator";
import { FindQuery } from "src/common/enums";

export class QueryShopDto extends FindQuery {
    @IsOptional()
    @IsMongoId()
    userID: string;
};