import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
  create(@Body() createShopDto: CreateShopDto) {
    return this.shopService.create(createShopDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.shopService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get()
  findShopItems(@Param('id') id: string) {
    return this.shopService.findShopItems(id)
  }

  @UseGuards(JwtGuard)
  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Get('user/:id/:page')
  findUserShops(@Param('id') id: string, @Param('page') page: number) {
    return this.shopService.findUserShops(id, page);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopService.update(id, updateShopDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopService.remove(id);
  }
}
