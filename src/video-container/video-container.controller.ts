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
} from "@nestjs/common";
import { VideoContainerService } from "./video-container.service";
import { CreateVideoContainerDto } from "./dto/create-video-container.dto";
import { UpdateVideoContainerDto } from "./dto/update-video-container.dto";
import { Types } from "mongoose";
import { MerchantGuard } from "src/auth/guards/merchant.guard";
import { ValidateObjectIdPipe } from "src/common/pipes/validate-object-id.pipe";
import { AuthenticationGuard } from "src/common/guard/authentication.guard";
import { AuthorizationGuard } from "src/common/guard/authorization.guard";
import { UserRole } from "src/user/schemas/user_schema";
import { AuthUser } from "src/common/decorator/param.decorator";
import { IAuthUser } from "src/common/enums";
import { Roles } from "src/common/decorator/roles";

@Controller("video-container")
export class VideoContainerController {
  constructor(private readonly videoContainerService: VideoContainerService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  create(
    @AuthUser() user: IAuthUser,
    @Body() createVideoContainerDto: CreateVideoContainerDto,
  ) {
    return this.videoContainerService.create(
      new Types.ObjectId(user.shopId),
      createVideoContainerDto,
    );
  }

  @Get(":id")
  findAll(@Param("id", ValidateObjectIdPipe) id: Types.ObjectId) {
    return this.videoContainerService.findAll(new Types.ObjectId(id));
  }

  @UseGuards(MerchantGuard)
  @Get("/one/:id")
  findOne(@Param("id", ValidateObjectIdPipe) id: string) {
    return this.videoContainerService.findOne(id);
  }

  @UseGuards(MerchantGuard)
  @Patch(":id")
  update(
    @Param("id", ValidateObjectIdPipe) id: string,
    @Body() updateVideoContainerDto: UpdateVideoContainerDto,
  ) {
    return this.videoContainerService.update(id, updateVideoContainerDto);
  }

  @UseGuards(MerchantGuard)
  @Delete(":id")
  remove(@Param("id", ValidateObjectIdPipe) id: string) {
    return this.videoContainerService.remove(id);
  }
}
