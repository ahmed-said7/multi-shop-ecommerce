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
  Req,
} from '@nestjs/common';
import { PhotoSliderService } from './photo-slider.service';
import { UpdatePhotoSliderDto } from './dto/update-photo-slider.dto';
import { PhotoSlider } from './schemas/photo-slider_schema';

import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

import { MerchantUser } from 'utils/extractors/merchant-user.param';
import { MerchantPayload } from 'src/merchant/merchant.service';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { UserRole } from 'src/user/schemas/user_schema';
import { Roles } from 'src/common/decorator/roles';
import { IAuthUser } from 'src/common/enums';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { Request } from 'express';

@Controller('photo-slider')
export class PhotoSliderController {
  constructor(private readonly photoSliderService: PhotoSliderService) {}

  private readonly logger = new Logger(PhotoSliderController.name);

  @Post()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  create(@AuthUser() user: IAuthUser) {
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
  remove(
    @Req() req:Request,
    @Param('id', ValidateObjectIdPipe) id: string
  ): Promise<string> {
    return this.photoSliderService.remove(id);
  }
}
