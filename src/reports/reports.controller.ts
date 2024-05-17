import { Controller, Get, Body, Param, Delete } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  findOne(
    @Body('userId') userId: string,
    @Body() createReportDto: CreateReportDto,
  ) {
    console.log(createReportDto);
    return this.reportsService.findOne(
      userId,
      createReportDto.report,
      createReportDto.year,
      createReportDto.month,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
