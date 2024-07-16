import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { reportTypes } from 'src/common/enums';

export class CreateReportDto {
  @IsNotEmpty()
  @IsEnum(reportTypes)
  report: reportTypes;
  @IsOptional()
  @IsNumber()
  year?: number;
  @IsOptional()
  @IsNumber()
  month?: number;
}
