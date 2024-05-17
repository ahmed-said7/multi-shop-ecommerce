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

@Controller('video-container')
export class VideoContainerController {
  constructor(private readonly videoContainerService: VideoContainerService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body('userId') userId: string,
    @Body() createVideoContainerDto: CreateVideoContainerDto,
  ) {
    return this.videoContainerService.create(userId, createVideoContainerDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Body('userId') userId: string) {
    return this.videoContainerService.findAll(userId);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoContainerService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVideoContainerDto: UpdateVideoContainerDto,
  ) {
    return this.videoContainerService.update(id, updateVideoContainerDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoContainerService.remove(id);
  }
}
