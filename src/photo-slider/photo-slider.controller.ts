import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PhotoSliderService } from './photo-slider.service';
import { CreatePhotoSliderDto } from './dto/create-photo-slider.dto';
import { UpdatePhotoSliderDto } from './dto/update-photo-slider.dto';
import { PhotoSlider } from './schemas/photo-slider_schema';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Types } from 'mongoose';

import { MerchantGuard } from 'src/auth/guards/merchant.guard';

@Controller('photo-slider')
export class PhotoSliderController {
  constructor(private readonly photoSliderService: PhotoSliderService) {}

  @UseGuards(JwtGuard, MerchantGuard)
  @Post()
  create(
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePhotoSliderDto: UpdatePhotoSliderDto,
  ): Promise<PhotoSlider | null> {
    return this.photoSliderService.update(id, updatePhotoSliderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<string> {
    return this.photoSliderService.remove(id);
  }
}
