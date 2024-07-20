import { IsBoolean, IsMongoId, IsOptional } from "class-validator";
import { FindQuery } from "src/common/enums";

export class QueryProductSliderDto extends FindQuery {
    @IsOptional()
    @IsMongoId()
    shopId: string;
    @IsOptional()
    isSlider:string;
};