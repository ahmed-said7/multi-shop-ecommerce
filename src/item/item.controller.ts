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
  Req,
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
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get('all-items/:shop/')
  findAll(
    @Param('shop') shopID: string,
    @Query('page') page: number,
    @Query('limitParam') limitParam: number,
    @Query('category') category: string,
    @Query('subCategory') subCategorey: string,
    @Query('sortOrder') sortOrder: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this.itemService.findAll(
      page,
      shopID,
      category,
      subCategorey,
      sortOrder,
      minPrice,
      maxPrice,
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
    @Req() request: Request,
  ) {
    return this.itemService.update(id, updateItemDto, request);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.itemService.remove(id, request);
  }
}
