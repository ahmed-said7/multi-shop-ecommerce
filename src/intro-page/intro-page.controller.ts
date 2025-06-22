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
} from '@nestjs/common';
import { IntroPageService } from './intro-page.service';
import { CreateIntroPageDto } from './dto/create-intro-page.dto';
import { UpdateIntroPageDto } from './dto/update-intro-page.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { Roles } from 'src/common/decorator/roles';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { AllRoles, IAuthUser } from 'src/common/enums';
import { QueryIntroPageDto } from './dto/query-intro-page.dto';

@Controller('intro-page')
export class IntroPageController {
  constructor(private readonly introPageService: IntroPageService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.MERCHANT)
  create(
    @Body() createIntroPageDto: CreateIntroPageDto,
    @AuthUser() user: IAuthUser,
  ) {
    return this.introPageService.create(createIntroPageDto, user.shopId);
  }

  @Get('shop/:shopId')
  findAll(
    @Param('shopId', ValidateObjectIdPipe) shopId: string,
    @Query() query: QueryIntroPageDto,
  ) {
    query.shopId = shopId;
    return this.introPageService.findAll(query);
  }

  @Get('/one/:id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.introPageService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.MERCHANT)
  @Patch(':id')
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateIntroPageDto: UpdateIntroPageDto,
    @AuthUser() user: IAuthUser,
  ) {
    return this.introPageService.update(id, user.shopId, updateIntroPageDto);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.MERCHANT)
  @Delete(':id')
  remove(
    @Param('id', ValidateObjectIdPipe) id: string,
    @AuthUser() user: IAuthUser,
  ) {
    return this.introPageService.remove(id, user.shopId);
  }
}
