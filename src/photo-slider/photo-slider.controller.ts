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
import { PhotoSliderService } from './photo-slider.service';
import { CreatePhotoSliderDto } from './dto/create-photo-slider.dto';
import { UpdatePhotoSliderDto } from './dto/update-photo-slider.dto';
import { PhotoSlider } from './schemas/photo-slider_schema';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Types } from 'mongoose';

import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';

@Controller('photo-slider')
export class PhotoSliderController {
  constructor(
    private readonly photoSliderService: PhotoSliderService,
    private readonly uploadService: UploadService,
  ) {}

  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtGuard)
  @Post()
  create(
    @UploadedFile('image') file: Express.Multer.File,
    @Body('shopId') shopId: Types.ObjectId,
    @Body() createPhotoSliderDto: CreatePhotoSliderDto,
  ): Promise<PhotoSlider> {
    return this.photoSliderService.create(shopId, createPhotoSliderDto);
  }

  @Get()
  findAll(): Promise<PhotoSlider[]> {
    return this.photoSliderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PhotoSlider | null> {
    return this.photoSliderService.findOne(id);
  }

  @UseGuards(JwtGuard, MerchantGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePhotoSliderDto: UpdatePhotoSliderDto,
  ): Promise<PhotoSlider | null> {
    return this.photoSliderService.update(id, updatePhotoSliderDto);
  }

  @UseGuards(JwtGuard, MerchantGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<string> {
    return this.photoSliderService.remove(id);
  }
}
