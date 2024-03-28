import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req
} from '@nestjs/common';

import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) { }

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() request: Request, @Body() createShopDto: CreateShopDto) {
    return this.shopService.create(createShopDto, request);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.shopService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get('items')
  findShopItems(@Req() request: Request, @Param('id') id?: string) {
    return this.shopService.findShopItems(request, id)
  }

  @UseGuards(JwtGuard)
  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Get('user/:id')
  findUserShops(@Param('id') id: string) {
    return this.shopService.findUserShops(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopService.update(id, updateShopDto);
  }

  @UseGuards(JwtGuard)
  @Delete()
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.shopService.remove(request);
  }

  @UseGuards(JwtGuard)
  @Get('containers/:id')
  findShopContainers(@Param('id') id: string) {
    return this.shopService.findShopContainers(id)
  }


}
