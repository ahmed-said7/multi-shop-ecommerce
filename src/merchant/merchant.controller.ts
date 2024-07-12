import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { MerchantService } from './merchant.service';
import { CreateMerchantDto } from './dto/createMerchant.dto';
import { UpdateMerchantDto } from './dto/updateMerchant.dto';

import { AdminGuard } from '../auth/guards/admin.guard';
import { ValidateMerchantGuard } from './guards/validate-merchant.guard';
import { ValidateObjectIdPipe } from 'src/pipes/validate-object-id.pipe';

@Controller('merchant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Post()
  create(@Body() data: CreateMerchantDto) {
    return this.merchantService.create(data);
  }

  @Post('login')
  login(@Body('email') email: string, @Body('password') password: string) {
    return this.merchantService.merchantSignIn(email, password);
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll(@Query('page') page?: number) {
    return this.merchantService.findAll(page);
  }

  @Get(':id')
  @UseGuards(ValidateMerchantGuard)
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.merchantService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ValidateMerchantGuard)
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() data: UpdateMerchantDto,
  ) {
    return this.merchantService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(ValidateMerchantGuard)
  delete(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.merchantService.delete(id);
  }
}
