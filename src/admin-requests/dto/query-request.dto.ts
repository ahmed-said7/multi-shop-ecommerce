import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";




export class QueryRequestDto {
    @IsOptional()
    @IsMongoId()
    userId:string;
    @IsOptional()
    type:string;
    @IsOptional()
    status:string;
    @IsOptional()
    page?:string;
    @IsOptional()
    sort?:string;
    @IsOptional()
    select?:string;
    @IsOptional()
    limit?:string;
};