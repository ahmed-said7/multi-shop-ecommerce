import { IsMongoId, IsOptional } from "class-validator";
import { FindQuery } from "src/common/enums";
export class QueryRequestDto extends FindQuery {
    @IsOptional()
    @IsMongoId()
    userId:string;
    @IsOptional()
    type:string;
    @IsOptional()
    status:string;
    @IsOptional()
    @IsMongoId()
    adminId:string;
};