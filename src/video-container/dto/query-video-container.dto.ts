import { IsMongoId, IsOptional } from "class-validator";
import { FindQuery } from "src/common/enums";
export class QueryVideoContainerDto extends FindQuery {
    @IsOptional()
    @IsMongoId()
    shopId: string;
};