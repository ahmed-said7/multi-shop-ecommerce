import { IsMongoId, IsOptional } from "class-validator";

export class QueryCategoryDto {
    @IsOptional()
    @IsMongoId()
    shopId?:string;
    @IsOptional()
    page?:string;
    @IsOptional()
    sort?:string;
    @IsOptional()
    select?:string;
    @IsOptional()
    limit?:string;
}