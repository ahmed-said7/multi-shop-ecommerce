import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import mongoose from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { MerchantPayload } from 'src/merchant/merchant.service';
import { MerchantUser } from 'utils/extractors/merchant-user.param';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { Merchant, MerchantDocument } from 'src/merchant/schema/merchant.schema';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { Roles } from 'src/common/decorator/roles';
import { UserRole } from 'src/user/schemas/user_schema';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { IAuthUser } from 'src/common/enums';

@Controller('shop')
export class ShopController {
  constructor(
    private readonly shopService: ShopService
  ) {}
  
  @Post()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.MERCHANT)
  create(
    @AuthUser('_id') userId: string,
    @Body() createShopDto: CreateShopDto,
  ) {
    return this.shopService.create(createShopDto, userId);
  }

  @Get()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.MERCHANT)
  findAll(@AuthUser('_id') userId: string) {
    return this.shopService.findAll(userId);
  }
  
  @Get('items')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.MERCHANT)
  findShopItems(
    @AuthUser('_id') userId: string,
    @Param('id', ValidateObjectIdPipe) id?: string,
  ) {
    return this.shopService.findShopItems(userId, id);
  }

  @Get('one/:id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.shopService.findOne(id);
  }

  @Patch('join/:id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  userJoin(
    @Param('id', ValidateObjectIdPipe) id: mongoose.Types.ObjectId,
    @AuthUser() user: IAuthUser,
  ) {
    return this.shopService.userJoin(id, user._id);
  }

  @Get('user/:id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  findUserShops(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.shopService.findUserShops(id);
  }

  @Patch()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @UseInterceptors(FileInterceptor('shop-logo'))
  @Roles(UserRole.MERCHANT)
  async update(
    @MerchantUser() user: Merchant,
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

  @Delete('/:id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  remove(
    @MerchantUser() user: Merchant,
    @Param('id', ValidateObjectIdPipe) id: string,
  ) {
    return this.shopService.remove(user.shopId, id);
  }

  @Get('containers/:id')
  findShopContainers(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.shopService.findShopContainers(id);
  }
}
