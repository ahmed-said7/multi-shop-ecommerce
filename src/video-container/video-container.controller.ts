import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors
} from '@nestjs/common';
import { VideoContainerService } from './video-container.service';
import { CreateVideoContainerDto } from './dto/create-video-container.dto';
import { UpdateVideoContainerDto } from './dto/update-video-container.dto';
import { Types } from 'mongoose';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { AllRoles, IAuthUser, optsVideo } from 'src/common/enums';
import { Roles } from 'src/common/decorator/roles';
import { QueryVideoContainerDto } from './dto/query-video-container.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadSingleFileInterceptor } from 'src/common/interceptors/upload-file.interceptor';

@Controller("video-container")
export class VideoContainerController {
  constructor(private readonly videoContainerService: VideoContainerService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @UseInterceptors(FileInterceptor("link",optsVideo),UploadSingleFileInterceptor)
  @Roles(AllRoles.MERCHANT)
  create(
    @AuthUser() user: IAuthUser,
    @Body() createVideoContainerDto: CreateVideoContainerDto,
  ) {
    return this.videoContainerService.create(
      user.shopId,
      createVideoContainerDto
    );
  }

  @Get(":id")
  findAll(
    @Param("id", ValidateObjectIdPipe) id: string,
    @Query() query:QueryVideoContainerDto
  ) {
    query.shopId=id;
    return this.videoContainerService.findAll(query);
  }

  
  @Get('/one/:id')
  // @UseGuards(AuthenticationGuard,AuthorizationGuard)
  // @Roles(AllRoles.MERCHANT)
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.videoContainerService.findOne(id);
  }

  
  @Patch(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @UseInterceptors(FileInterceptor("link",optsVideo),UploadSingleFileInterceptor)
  @Roles(AllRoles.MERCHANT)
  update(
    @Param("id", ValidateObjectIdPipe) id: string,
    @Body() updateVideoContainerDto: UpdateVideoContainerDto,
    @AuthUser() user: IAuthUser
  ) {
    return this.videoContainerService.update(id, user.shopId,updateVideoContainerDto);
  };


  @Delete(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.MERCHANT)
  remove(
    @Param('id', ValidateObjectIdPipe) id: string,
    @AuthUser() user: IAuthUser
  ) {
    return this.videoContainerService.remove(id,user.shopId);
  };
}
