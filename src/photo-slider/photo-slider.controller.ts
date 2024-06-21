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
  Logger,
  UploadedFiles,
} from '@nestjs/common';
import { PhotoSliderService } from './photo-slider.service';
import { UpdatePhotoSliderDto } from './dto/update-photo-slider.dto';
import { PhotoSlider } from './schemas/photo-slider_schema';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('photo-slider')
export class PhotoSliderController {
  constructor(private readonly photoSliderService: PhotoSliderService) {}

  private readonly logger = new Logger(PhotoSliderController.name);

  @UseGuards(JwtGuard)
  @Post()
  create(@Body('shopId') shopId: string) {
    return this.photoSliderService.create(shopId);
  }

  @UseGuards(JwtGuard)
  @Post('preview')
  @UseInterceptors(FilesInterceptor('images'))
  uploadPreviewImages(@UploadedFiles() files: Express.Multer.File[]) {
    return this.photoSliderService.uploadFilesToView(files);
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
