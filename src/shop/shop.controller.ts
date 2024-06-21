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
  UseInterceptors,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import mongoose from 'mongoose';
import { Request } from 'express';
import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { UploadService } from 'src/upload/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('shop')
export class ShopController {
  constructor(
    private readonly shopService: ShopService,
    private readonly uploadService: UploadService,
  ) {}

  private readonly logger = new Logger(ShopController.name);

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

  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(id);
  }

  @UseGuards(MerchantGuard)
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

  @Patch()
  @UseGuards(MerchantGuard)
  @UseInterceptors(FileInterceptor('shop-logo'))
  async update(
    @Body('shopId') shopId: string,
    @Body() updateShopDto: UpdateShopDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = await this.uploadService.uploadFile(file);
    updateShopDto.logo = url;

    return await this.shopService.update(shopId, updateShopDto);
  }

  @UseGuards(MerchantGuard)
  @Delete('/:id')
  remove(@Body('shopId') shopId: string, @Param('id') id: string) {
    return this.shopService.remove(shopId, id);
  }

  @UseGuards(JwtGuard)
  @Get('containers/:id')
  findShopContainers(@Param('id') id: string) {
    return this.shopService.findShopContainers(id);
  }
}
