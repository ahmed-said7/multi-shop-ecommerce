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
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { UserRole } from 'src/user/schemas/user_schema';
import { Roles } from 'src/common/decorator/roles';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @Get()
  // @Redirect('/user')
  // findAll() {}

  @Get(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.adminService.findOne(id);
  };

  @Patch(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.adminService.update(id, updateUserDto);
  };

  @Delete(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN)
  remove(
    @Param('id', ValidateObjectIdPipe) deleteId: string
  ) {
    return this.adminService.remove(deleteId);
  }
}
