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
import { VideoContainerService } from './video-container.service';
import { CreateVideoContainerDto } from './dto/create-video-container.dto';
import { UpdateVideoContainerDto } from './dto/update-video-container.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Types } from 'mongoose';
import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { ValidateObjectIdPipe } from 'src/pipes/validate-object-id.pipe';

@Controller('video-container')
export class VideoContainerController {
  constructor(private readonly videoContainerService: VideoContainerService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body('shopId') shopId: Types.ObjectId,
    @Body() createVideoContainerDto: CreateVideoContainerDto,
  ) {
    return this.videoContainerService.create(shopId, createVideoContainerDto);
  }

  @Get(':id')
  findAll(@Param('id', ValidateObjectIdPipe) id: Types.ObjectId) {
    return this.videoContainerService.findAll(new Types.ObjectId(id));
  }

  @UseGuards(MerchantGuard)
  @Get('/one/:id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.videoContainerService.findOne(id);
  }

  @UseGuards(MerchantGuard)
  @Patch(':id')
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateVideoContainerDto: UpdateVideoContainerDto,
  ) {
    return this.videoContainerService.update(id, updateVideoContainerDto);
  }

  @UseGuards(MerchantGuard)
  @Delete(':id')
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.videoContainerService.remove(id);
  }
}
