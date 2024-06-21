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
import { MerchantPayload } from 'src/merchant/merchant.service';

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

  @UseGuards(MerchantGuard)
  @UseInterceptors(FileInterceptor('shop-logo'))
  @Patch()
  async update(
    @Req() request: Request,
    @Body() updateShopDto: UpdateShopDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = request.user as MerchantPayload;

    const shop = await this.shopService.update(
      user.shopId,
      file,
      updateShopDto,
    );

    return shop;
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
