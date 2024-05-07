import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('admin-statistics')
export class AdminStatisticsController {
  constructor(private readonly adminService: AdminService) { }
  
  @UseGuards(JwtGuard)
  @Get('/registrations-per-month')
  async getRegistrationsPerMonth(@Req() request: Request){
    return this.adminService.getUsersPerMonth(request);
  }
 
  @UseGuards(JwtGuard)
  @Get('/shops-per-month')
  async getshopsPerMonth(@Req() request: Request) {
    return this.adminService.getShopsPerMonth(request);
  }
}
