import { IsMongoId, IsOptional } from "class-validator";
import { FindQuery } from "src/common/enums";

export class QueryPhotoSliderDto extends FindQuery {
    @IsOptional()
    @IsMongoId()
    shopId: string;
};