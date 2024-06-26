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
import { IntroPageService } from './intro-page.service';
import { CreateIntroPageDto } from './dto/create-intro-page.dto';
import { UpdateIntroPageDto } from './dto/update-intro-page.dto';

import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { Types } from 'mongoose';
import { ValidateObjectIdPipe } from 'src/pipes/validate-object-id.pipe';
import { MerchantPayload } from 'src/merchant/merchant.service';
import { MerchantUser } from 'utils/extractors/merchant-user.param';

@Controller('intro-page')
export class IntroPageController {
  constructor(private readonly introPageService: IntroPageService) {}

  @UseGuards(MerchantGuard)
  @Post()
  create(
    @Body() createIntroPageDto: CreateIntroPageDto,
    @MerchantUser() user: MerchantPayload,
  ) {
    return this.introPageService.create(
      createIntroPageDto,
      Types.ObjectId.createFromHexString(user.shopId),
    );
  }

  @Get(':id')
  findAll(@Param('id', ValidateObjectIdPipe) id?: Types.ObjectId) {
    return this.introPageService.findAll(new Types.ObjectId(id));
  }

  @Get('/one/:id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.introPageService.findOne(id);
  }

  @UseGuards(MerchantGuard)
  @Patch(':id')
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateIntroPageDto: UpdateIntroPageDto,
  ) {
    return this.introPageService.update(id, updateIntroPageDto);
  }

  @UseGuards(MerchantGuard)
  @Delete(':id')
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.introPageService.remove(id);
  }
}
