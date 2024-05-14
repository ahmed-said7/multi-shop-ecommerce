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
} from '@nestjs/common';
import { PhotoSlideService } from './photo-slide.service';
import { CreatePhotoSlideDto } from './dto/create-photo-slide.dto';
import { UpdatePhotoSlideDto } from './dto/update-photo-slide.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import mongoose from 'mongoose';

@Controller('photo-slide')
export class PhotoSlideController {
  constructor(private readonly photoSlideService: PhotoSlideService) { }

  @Post()
  create(@Body() createPhotoSlideDto: CreatePhotoSlideDto) {
    return this.photoSlideService.create(createPhotoSlideDto);
  }

  // @Post('container')
  // createCollection(@Body() createPhotoSlideDto: CreatePhotoSlideDto[]) {
  //   return this.photoSlideService.createCollection(createPhotoSlideDto);
  // }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Body() photoSlider: mongoose.Types.ObjectId) {
    return this.photoSlideService.findAll(photoSlider);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photoSlideService.findOne(id);
  }

  @Patch(':id')
  update(@Param() id: mongoose.Types.ObjectId, @Body() updatePhotoSlideDto: UpdatePhotoSlideDto) {
    return this.photoSlideService.update(id, updatePhotoSlideDto);
  }

  @Delete(':id')
  remove(@Param('id') id: mongoose.Types.ObjectId) {
    return this.photoSlideService.remove(id);
  }
}
