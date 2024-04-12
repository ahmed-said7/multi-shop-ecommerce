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
    @Req() request: Request,
    @Body() createVideoContainerDto: CreateVideoContainerDto,
  ) {
    return this.videoContainerService.create(request, createVideoContainerDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Req() request: Request) {
    return this.videoContainerService.findAll(request);
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
