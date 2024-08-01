import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import authorizationGuard from 'src/common/guard/authorization.guard';
import { Roles } from 'src/common/decorator/roles';
import { AllRoles } from 'src/common/enums';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get(':id')
  @UseGuards(AuthenticationGuard, authorizationGuard.AuthorizationGuard)
  @Roles(AllRoles.ADMIN)
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, authorizationGuard.AuthorizationGuard)
  @Roles(AllRoles.ADMIN)
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.adminService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, authorizationGuard.AuthorizationGuard)
  @Roles(AllRoles.ADMIN)
  remove(@Param('id', ValidateObjectIdPipe) deleteId: string) {
    return this.adminService.remove(deleteId);
  }
}
