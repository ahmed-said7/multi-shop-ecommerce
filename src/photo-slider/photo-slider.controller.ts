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
  UploadedFiles,
  Req,
  Query,
} from '@nestjs/common';
import { PhotoSliderService } from './photo-slider.service';
import { UpdatePhotoSliderDto } from './dto/update-photo-slider.dto';
import { PhotoSlider } from './schemas/photo-slider_schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { UserRole } from 'src/user/schemas/user_schema';
import { Roles } from 'src/common/decorator/roles';
import { IAuthUser } from 'src/common/enums';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { Request } from 'express';
import { CreatePhotoSliderDto } from './dto/create-photo-slider.dto';
import { QueryPhotoSliderDto } from './dto/query-photo-slider.dto';

@Controller('photo-slider')
export class PhotoSliderController {
  constructor(private readonly photoSliderService: PhotoSliderService) {}

  @Post()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  create(
    @AuthUser("shopId") shopId: string,
    @Body() body:CreatePhotoSliderDto 
  ) {
    return this.photoSliderService.create(shopId,body);
  }

  // @Post('preview')
  // @UseGuards(AuthenticationGuard,AuthorizationGuard)
  // @Roles(UserRole.MERCHANT)
  // @UseInterceptors(FilesInterceptor('images'))
  // uploadPreviewImages(@UploadedFiles() files: Express.Multer.File[]) {
  //   return this.photoSliderService.uploadFilesToView(files);
  // }

  @Get()
  findAll(@Query() query:QueryPhotoSliderDto ) {
    return this.photoSliderService.findAll(query);
  }

  @Get(':id')
  findOne(
    @Param('id', ValidateObjectIdPipe) id: string,
  ){
    return this.photoSliderService.findOne(id);
  }

  
  @Patch(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updatePhotoSliderDto: UpdatePhotoSliderDto,
    @AuthUser("shopId") shopId: string
  ){
    return this.photoSliderService.update(id,shopId, updatePhotoSliderDto);
  }

  
  @Delete(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  remove(
    @AuthUser("shopId") shopId: string,
    @Param('id', ValidateObjectIdPipe) id: string
  ){
    return this.photoSliderService.remove(id,shopId);
  }
}
