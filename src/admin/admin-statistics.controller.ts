import { Controller, Get, UseGuards, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('admin-statistics')
export class AdminStatisticsController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtGuard)
  @Get('/registrations-per-month')
  async getRegistrationsPerMonth(@Body('userId') userId: string) {
    return this.adminService.getUsersPerMonth(userId);
  }

  @UseGuards(JwtGuard)
  @Get('/shops-per-month')
  async getshopsPerMonth(@Body('userId') userId: string) {
    return this.adminService.getShopsPerMonth(userId);
  }
}
