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
  Logger,
} from '@nestjs/common';

import mongoose, { Types } from 'mongoose';

import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { UploadService } from 'src/upload/upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MerchantUser } from 'utils/extractors/merchant-user.param';
import { MerchantPayload } from 'src/merchant/merchant.service';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';

@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly uploadService: UploadService,
  ) {}

  private readonly logger = new Logger(ItemController.name);

  @UseGuards(MerchantGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createItemDto: CreateItemDto,
    @UploadedFiles() files: Express.Multer.File[],
    @MerchantUser() user: MerchantPayload,
  ) {
    const imageUrls = await this.uploadService.uploadFiles(files);
    createItemDto.images = imageUrls;

    this.logger.log(createItemDto);

    return this.itemService.create(createItemDto, user.shopId);
  }

  @Get('all-items/:shop')
  findAll(
    @Param('shop') shopId: string,
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
      shopId,
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
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.itemService.findOne(id);
  }

  @UseGuards(MerchantGuard)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateItemDto: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imageUrls = await this.uploadService.uploadFiles(files);

    updateItemDto.images = imageUrls;

    return this.itemService.update(id, updateItemDto);
  }

  @UseGuards(MerchantGuard)
  @Delete(':id')
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.itemService.remove(id);
  }
}
