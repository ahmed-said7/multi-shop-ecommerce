import { Controller, Get, Post, Body, Patch, Param, Delete, Redirect, Logger } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get()
  @Redirect('/user')
  findAll() { }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') userId: string, @Body('id') deleteId: string) {
    return this.adminService.remove(userId, deleteId);
  }
}
