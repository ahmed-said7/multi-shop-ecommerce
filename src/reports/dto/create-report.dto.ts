import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { reportTypes } from 'src/common/enums';

export class CreateReportDto {
  // @IsNotEmpty({ message:i18nValidationMessage("validation.report.report.isNotEmpty") })
  @IsEnum(reportTypes, {
    message: i18nValidationMessage('validation.report.report.isEnum'),
  })
  report: reportTypes;
  @IsOptional()
  @IsNumber(
    {},
    { message: i18nValidationMessage('validation.report.year.isNumber') },
  )
  year?: number;
  @IsOptional()
  @IsNumber(
    {},
    { message: i18nValidationMessage('validation.report.month.isNumber') },
  )
  month?: number;
}
