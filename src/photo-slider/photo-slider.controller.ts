import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PhotoSliderService } from './photo-slider.service';
import { CreatePhotoSliderDto } from './dto/create-photo-slider.dto';
import { UpdatePhotoSliderDto } from './dto/update-photo-slider.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('photo-slider')
export class PhotoSliderController {
  constructor(private readonly photoSliderService: PhotoSliderService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body('userId') userId: string,
    @Body() createPhotoSliderDto: CreatePhotoSliderDto,
  ) {
    return this.photoSliderService.create(userId, createPhotoSliderDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Body('userId') userId: string) {
    return this.photoSliderService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photoSliderService.findOne(+id);
  }

  @Patch('add/:id')
  addPhotoSlide(
    @Param('id') id: string,
    @Body() updatePhotoSliderDto: UpdatePhotoSliderDto,
  ) {
    return this.photoSliderService.addPhotoSlide(+id, updatePhotoSliderDto);
  }

  @Patch('remove/:id')
  removePhotoSlides(
    @Param('id') id: string,
    @Body() updatePhotoSliderDto: UpdatePhotoSliderDto,
  ) {
    return this.photoSliderService.removePhotoSlide(+id, updatePhotoSliderDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePhotoSliderDto: UpdatePhotoSliderDto,
  ) {
    return this.photoSliderService.update(id, updatePhotoSliderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.photoSliderService.remove(id);
  }
}
