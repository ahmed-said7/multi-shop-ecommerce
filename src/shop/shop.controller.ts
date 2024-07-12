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
import { MerchantUser } from 'utils/extractors/merchant-user.param';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';

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
  findAll(@Body('userId', ValidateObjectIdPipe) userId: string) {
    return this.shopService.findAll(userId);
  }

  @Get('items')
  findShopItems(
    @Body('userId', ValidateObjectIdPipe) userId: string,
    @Param('id', ValidateObjectIdPipe) id?: string,
  ) {
    return this.shopService.findShopItems(userId, id);
  }

  @Get('one/:id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.shopService.findOne(id);
  }

  @UseGuards(MerchantGuard)
  @Patch('join/:id')
  userJoin(
    @Param('id', ValidateObjectIdPipe) id: mongoose.Types.ObjectId,
    @MerchantUser() user: MerchantPayload,
  ) {
    return this.shopService.userJoin(id, user.id);
  }

  @UseGuards(MerchantGuard)
  @Get('user/:id')
  findUserShops(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.shopService.findUserShops(id);
  }

  @UseGuards(MerchantGuard)
  @UseInterceptors(FileInterceptor('shop-logo'))
  @Patch()
  async update(
    @MerchantUser() user: MerchantPayload,
    @Body() updateShopDto: UpdateShopDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const shop = await this.shopService.update(
      user.shopId,
      file,
      updateShopDto,
    );

    return shop;
  }

  @UseGuards(MerchantGuard)
  @Delete('/:id')
  remove(
    @MerchantUser() user: MerchantPayload,
    @Param('id', ValidateObjectIdPipe) id: string,
  ) {
    return this.shopService.remove(user.shopId, id);
  }

  @Get('containers/:id')
  findShopContainers(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.shopService.findShopContainers(id);
  }
}
