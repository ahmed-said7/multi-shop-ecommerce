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
import { Banner } from './schemas/banner_schema';
import { Types } from 'mongoose';

import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { MerchantPayload } from 'src/merchant/merchant.service';
import { MerchantUser } from 'utils/extractors/merchant-user.param';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { IAuthUser } from 'src/common/enums';

@Controller('banner')
export class BannerController {
  constructor(
    private readonly bannerService: BannerService,
    private readonly uploadService: UploadService,
  ) {}

  @UseGuards(MerchantGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: IAuthUser,
    @Body() createBannerDto: CreateBannerDto,
  ) {
    const url = await this.uploadService.uploadFile(file);
    createBannerDto.image = url as string;

    return this.bannerService.create(
      Types.ObjectId.createFromHexString(user.shopId),
      createBannerDto,
    );
  }

  @Get()
  findAll(): Promise<Banner[]> {
    return this.bannerService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ValidateObjectIdPipe) id: string,
  ): Promise<Banner | null> {
    return this.bannerService.findOne(id);
  }

  @UseGuards(MerchantGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateBannerDto: UpdateBannerDto,
  ): Promise<Banner | null> {
    const url = await this.uploadService.uploadFile(file);
    updateBannerDto.image = url as string;
    return this.bannerService.update(id, updateBannerDto);
  }

  @UseGuards(MerchantGuard)
  @Delete(':id')
  remove(@Param('id', ValidateObjectIdPipe) id: string): Promise<string> {
    return this.bannerService.remove(id);
  }
}
