import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Banner } from './schemas/banner_schema';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Types } from 'mongoose';

import { MerchantGuard } from 'src/auth/guards/merchant.guard';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body('shopId') shopId: Types.ObjectId,
    @Body() createBannerDto: CreateBannerDto,
  ): Promise<Banner> {
    return this.bannerService.create(shopId, createBannerDto);
  }

  @Get()
  findAll(): Promise<Banner[]> {
    return this.bannerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Banner | null> {
    return this.bannerService.findOne(id);
  }

  @UseGuards(JwtGuard, MerchantGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
  ): Promise<Banner | null> {
    return this.bannerService.update(id, updateBannerDto);
  }

  @UseGuards(JwtGuard, MerchantGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<string> {
    return this.bannerService.remove(id);
  }
}
