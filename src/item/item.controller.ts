import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createItemDto: CreateItemDto, @Body('shopId') shopId: string) {
    return this.itemService.create(createItemDto, shopId);
  }

  @Get('all-items/:shop/')
  findAll(
    @Param('shop') shopID: string,
    @Query('page') page: number,
    @Query('limitParam') limitParam: number,
    @Query('category') category: string,
    @Query('subCategory') subCategory: string,
    @Query('sortOrder') sortOrder: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('keyword') keyword?: string,
  ) {
    return this.itemService.findAll(
      page,
      shopID,
      category,
      subCategory,
      sortOrder,
      minPrice,
      maxPrice,
      keyword,
      limitParam,
    );
  }

  @Get('one-item/:id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @Body('userId') userId: string,
  ) {
    return this.itemService.update(id, updateItemDto, userId);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Body('userId') userId: string) {
    return this.itemService.remove(id, userId);
  }
}
