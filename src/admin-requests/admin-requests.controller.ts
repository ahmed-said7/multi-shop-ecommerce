import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AdminRequestsService } from './admin-requests.service';
import { CreateAdminRequestDto } from './dto/create-admin-request.dto';
import { UpdateAdminRequestDto } from './dto/update-admin-request.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';

@Controller('admin-requests')
export class AdminRequestsController {
  constructor(private readonly adminRequestsService: AdminRequestsService) {}

  @Post()
  create(@Body() createAdminRequestDto: CreateAdminRequestDto) {
    return this.adminRequestsService.create(createAdminRequestDto);
  }

  @Get()
  findAll(@Query('userId', ValidateObjectIdPipe) userId?: string) {
    return this.adminRequestsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.adminRequestsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateAdminRequestDto: UpdateAdminRequestDto,
    @Query('userId', ValidateObjectIdPipe) userId: string,
  ) {
    return this.adminRequestsService.update(id, updateAdminRequestDto, userId);
  }

  @Delete(':id')
  remove(
    @Query('userId', ValidateObjectIdPipe) userId: string,
    @Param('id', ValidateObjectIdPipe) id: string,
  ) {
    return this.adminRequestsService.remove(id, userId);
  }
}
