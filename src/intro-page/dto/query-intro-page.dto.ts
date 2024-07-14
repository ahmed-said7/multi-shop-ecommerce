import { IsMongoId, IsOptional } from "class-validator";
import { FindQuery } from "src/common/enums";

export class QueryIntroPageDto extends FindQuery {
    @IsOptional()
    @IsMongoId()
    shopId?:string;
};