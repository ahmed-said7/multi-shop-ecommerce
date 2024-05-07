import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  findOne(@Req() request:Request, @Body() CreateReportDto:CreateReportDto) {
    console.log(CreateReportDto)
    return this.reportsService.findOne(request,CreateReportDto.report,CreateReportDto.year , CreateReportDto.month);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
