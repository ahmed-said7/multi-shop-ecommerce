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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';

import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import mongoose, { Types } from 'mongoose';
import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { UploadService } from 'src/upload/upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly uploadService: UploadService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createItemDto: CreateItemDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('shopId') shopId: string,
  ) {
    const imageUrls = await this.uploadService.uploadFiles(files);
    createItemDto.images = imageUrls;
    return this.itemService.create(createItemDto, shopId);
  }

  @Get('all-items/:shop/')
  findAll(
    @Param('shop') shopId: Types.ObjectId,
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
      new mongoose.Types.ObjectId(shopId),
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

  @UseGuards(MerchantGuard)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imageUrls = await this.uploadService.uploadFiles(files);
    updateItemDto.images = imageUrls;
    return this.itemService.update(id, updateItemDto);
  }

  @UseGuards(MerchantGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(id);
  }

  @UseGuards(MerchantGuard)
  @Delete('/image/:id')
  removeImage(@Param('id') id: string, @Body('image') image: string) {
    return this.itemService.removeImage(id, image);
  }
}
