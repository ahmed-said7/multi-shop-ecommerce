import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty({ message: 'A shop must have a title' })
  @IsString({ message: 'A shop must have a string title' })
  report: string;

  year?: string;

  month?: string;
}
