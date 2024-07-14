import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  report: string;
  @IsOptional()
  @IsNumber()
  year?: number;
  @IsOptional()
  @IsNumber()
  month?: number;
}
