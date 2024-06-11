import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Redirect,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @Redirect('/user')
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') userId: string, @Body('id') deleteId: string) {
    return this.adminService.remove(userId, deleteId);
  }
}
