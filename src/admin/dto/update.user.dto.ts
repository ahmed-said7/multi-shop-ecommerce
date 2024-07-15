import {  IsEnum,  IsOptional } from "class-validator";
import {  UserRole } from "src/common/enums";

export class UpdateUserByAdminDto {
    @IsOptional()
    @IsEnum(UserRole, { message: 'Invalid user role' })
    role: UserRole;
}