import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PhotoSliderService } from './photo-slider.service';
import { CreatePhotoSliderDto } from './dto/create-photo-slider.dto';
import { UpdatePhotoSliderDto } from './dto/update-photo-slider.dto';

@Controller('photo-slider')
export class PhotoSliderController {
  constructor(private readonly photoSliderService: PhotoSliderService) {}

  @Post()
  create(@Body() createPhotoSliderDto: CreatePhotoSliderDto) {
    return this.photoSliderService.create(createPhotoSliderDto);
  }

  @Post('container')
  createCollection(@Body() createPhotoSliderDto: CreatePhotoSliderDto[]) {
    return this.photoSliderService.createCollection(createPhotoSliderDto);
  }

  @Get()
  findAll() {
    return this.photoSliderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photoSliderService.findOne(id);
  }

  @Patch()
  update(@Body() updatePhotoSliderDto: UpdatePhotoSliderDto[]) {
    return this.photoSliderService.update(updatePhotoSliderDto);
  }

  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.photoSliderService.remove(name);
  }
}
