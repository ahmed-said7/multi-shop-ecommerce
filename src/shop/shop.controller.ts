import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import mongoose from 'mongoose';
import { Request } from 'express';
import { MerchantGuard } from 'src/auth/guards/merchant.guard';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Req() req: Request,
    @Body('userId') userId: string,
    @Body() createShopDto: CreateShopDto,
  ) {
    console.log(req.body.userId);

    return this.shopService.create(createShopDto, userId);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Body('userId') userId: string) {
    return this.shopService.findAll(userId);
  }

  @UseGuards(JwtGuard)
  @Get('items')
  findShopItems(@Body('userId') userId: string, @Param('id') id?: string) {
    return this.shopService.findShopItems(userId, id);
  }

  // @UseGuards(JwtGuard)
  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(id);
  }

  @UseGuards(JwtGuard, MerchantGuard)
  @Patch('join/:id')
  userJoin(
    @Param('id') id: mongoose.Types.ObjectId,
    @Body('userId') userId: string,
  ) {
    return this.shopService.userJoin(id, userId);
  }

  @UseGuards(JwtGuard)
  @Get('user/:id')
  findUserShops(@Param('id') id: string) {
    return this.shopService.findUserShops(id);
  }

  @UseGuards(JwtGuard, MerchantGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopService.update(id, updateShopDto);
  }

  @UseGuards(JwtGuard, MerchantGuard)
  @Delete('/:id')
  remove(@Body('userId') userId: string, @Param('id') shopId: string) {
    return this.shopService.remove(userId, shopId);
  }

  @UseGuards(JwtGuard)
  @Get('containers/:id')
  findShopContainers(@Param('id') id: string) {
    return this.shopService.findShopContainers(id);
  }
}
