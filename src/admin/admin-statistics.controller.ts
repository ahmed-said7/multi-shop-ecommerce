import { Controller, Get, UseGuards, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { Roles } from 'src/common/decorator/roles';
import { UserRole } from 'src/user/schemas/user_schema';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthUser } from 'src/common/decorator/param.decorator';

@Controller('admin-statistics')
export class AdminStatisticsController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/registrations-per-month')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN)
  async getRegistrationsPerMonth() {
    return this.adminService.getUsersPerMonth();
  }

  
  @Get('/shops-per-month')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN)
  async getshopsPerMonth() {
    return this.adminService.getShopsPerMonth();
  }
}
