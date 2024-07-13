import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { MerchantService } from './merchant.service';
import { CreateMerchantDto } from './dto/createMerchant.dto';
import { UpdateMerchantDto } from './dto/updateMerchant.dto';

import { AdminGuard } from '../auth/guards/admin.guard';
import { ValidateMerchantGuard } from './guards/validate-merchant.guard';
import { ValidateObjectIdPipe } from 'src/pipes/validate-object-id.pipe';
import { Request } from 'express';

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
  findAll( @Query('page') page?: string ) {
    return this.merchantService.findAll(page);
  }

  @Get(':id')
  @UseGuards(ValidateMerchantGuard)
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.merchantService.findOne(id);
  }

  @Get("logged-user")
  @UseGuards(ValidateMerchantGuard)
  findMe(@Req() req:Request) {
    return this.merchantService.findOne(req.user._id);
  }

  @Patch(':id')
  @UseGuards(ValidateMerchantGuard)
  update(
    @Req() req:Request,
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() data: UpdateMerchantDto,
  ) {
    req.user
    return this.merchantService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(ValidateMerchantGuard)
  delete(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.merchantService.delete(id);
  }
}
