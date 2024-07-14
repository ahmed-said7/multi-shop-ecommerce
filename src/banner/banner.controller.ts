import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { IAuthUser } from 'src/common/enums';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { Roles } from 'src/common/decorator/roles';
import { UserRole } from 'src/user/schemas/user_schema';
import { QueryBannerDto } from './dto/query-banner.dto';

@Controller('banner')
export class BannerController {
  constructor(
    private readonly bannerService: BannerService
  ) {}

  @Post()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: IAuthUser,
    @Body() createBannerDto: CreateBannerDto,
  ) {
    // const url = await this.uploadService.uploadFile(file);
    // createBannerDto.image = url as string;

    return this.bannerService.create(
      user.shopId,
      createBannerDto,
    );
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  findAll( @Body() query:QueryBannerDto  ) {
    return this.bannerService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  // @Roles(UserRole.MERCHANT,UserRole.ADMIN)
  findOne(
    @Param('id', ValidateObjectIdPipe) bannerId: string,
  ){
    return this.bannerService.findOne(bannerId);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateBannerDto: UpdateBannerDto,
    @AuthUser() user: IAuthUser
  ) {
    // const url = await this.uploadService.uploadFile(file);
    // updateBannerDto.image = url as string;
    return this.bannerService.update(id, updateBannerDto,user);
  }


  @Delete(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  remove(
    @Param('id', ValidateObjectIdPipe) id: string,
    @AuthUser() user: IAuthUser
  ) {
    return this.bannerService.remove(id,user);
  }
}
