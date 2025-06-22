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
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import mongoose from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { Roles } from 'src/common/decorator/roles';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { AllRoles, IAuthUser, optsImg } from 'src/common/enums';
import { QueryShopDto } from './dto/query-shop.dto';
import { UploadSingleFileInterceptor } from 'src/common/interceptors/upload-file.interceptor';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @UseInterceptors(
    FileInterceptor('logo', optsImg),
    UploadSingleFileInterceptor,
  )
  @Roles(AllRoles.MERCHANT)
  create(@AuthUser() user: IAuthUser, @Body() createShopDto: CreateShopDto) {
    return this.shopService.create(createShopDto, user);
  }

  @Get()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.ADMIN, AllRoles.USER, AllRoles.MERCHANT)
  findAll(@Query() query: QueryShopDto) {
    return this.shopService.findAll(query);
  }

  @Get('items/:id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.ADMIN, AllRoles.USER, AllRoles.MERCHANT)
  findShopItems(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.shopService.findShopItems(id);
  }

  @Get('one/:id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.shopService.findOne(id);
  }

  @Patch('join/:id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.USER)
  userJoin(
    @Param('id', ValidateObjectIdPipe) id: mongoose.Types.ObjectId,
    @AuthUser() user: IAuthUser,
  ) {
    return this.shopService.userJoin(id, user._id);
  }

  @Patch('add/:id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.MERCHANT)
  addJoin(
    @Param('id', ValidateObjectIdPipe) id: string,
    @AuthUser() user: IAuthUser,
  ) {
    return this.shopService.addUser(user.shopId, id);
  }

  @Get('user/:id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.MERCHANT, AllRoles.ADMIN, AllRoles.USER)
  findMerchantShops(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.shopService.findUserShops(id);
  }

  @Patch()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @UseInterceptors(
    FileInterceptor('logo', optsImg),
    UploadSingleFileInterceptor,
  )
  @Roles(AllRoles.MERCHANT)
  async update(
    @AuthUser() user: IAuthUser,
    @Body() updateShopDto: UpdateShopDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.shopService.update(user.shopId, file, updateShopDto);
  }

  @Delete('/:id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.MERCHANT, AllRoles.ADMIN)
  remove(
    @AuthUser() user: IAuthUser,
    @Param('id', ValidateObjectIdPipe) id: string,
  ) {
    return this.shopService.remove(user, id);
  }

  @Get('containers/:id')
  findShopContainers(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.shopService.findShopContainers(id);
  }
}
