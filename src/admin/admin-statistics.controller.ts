import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { Roles } from 'src/common/decorator/roles';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AllRoles } from 'src/common/enums';

@Controller('admin-statistics')
export class AdminStatisticsController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/registrations-per-month')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.ADMIN)
  async getRegistrationsPerMonth() {
    return this.adminService.getUsersPerMonth();
  }

  
  @Get('/shops-per-month')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.ADMIN)
  async getshopsPerMonth() {
    return this.adminService.getShopsPerMonth();
  }
}
