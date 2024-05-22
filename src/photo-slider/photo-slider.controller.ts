import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PhotoSliderService } from './photo-slider.service';
import { CreatePhotoSliderDto } from './dto/create-photo-slider.dto';
import { UpdatePhotoSliderDto } from './dto/update-photo-slider.dto';
import { PhotoSlider } from './schemas/photo-slider_schema';

@Controller('photo-slider')
export class PhotoSliderController {
  constructor(private readonly photoSliderService: PhotoSliderService) {}

  @Post()
  create(
    @Body() createPhotoSliderDto: CreatePhotoSliderDto,
  ): Promise<PhotoSlider> {
    return this.photoSliderService.create(createPhotoSliderDto);
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
  remove(@Param('id') id: string): Promise<void> {
    return this.photoSliderService.remove(id);
  }
}
