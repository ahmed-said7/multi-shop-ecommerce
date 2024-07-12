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

import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

import { MerchantUser } from 'utils/extractors/merchant-user.param';
import { MerchantPayload } from 'src/merchant/merchant.service';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';

@Controller('photo-slider')
export class PhotoSliderController {
  constructor(private readonly photoSliderService: PhotoSliderService) {}

  private readonly logger = new Logger(PhotoSliderController.name);

  @UseGuards(MerchantGuard)
  @Post()
  create(@MerchantUser() user: MerchantPayload) {
    return this.photoSliderService.create(user.shopId);
  }

  @UseGuards(MerchantGuard)
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
  findOne(
    @Param('id', ValidateObjectIdPipe) id: string,
  ): Promise<PhotoSlider | null> {
    return this.photoSliderService.findOne(id);
  }

  @UseGuards(MerchantGuard)
  @Patch(':id')
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updatePhotoSliderDto: UpdatePhotoSliderDto,
  ): Promise<PhotoSlider | null> {
    return this.photoSliderService.update(id, updatePhotoSliderDto);
  }

  @UseGuards(MerchantGuard)
  @Delete(':id')
  remove(@Param('id', ValidateObjectIdPipe) id: string): Promise<string> {
    return this.photoSliderService.remove(id);
  }
}
