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
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { Types } from 'mongoose';

@Controller('intro-page')
export class IntroPageController {
  constructor(private readonly introPageService: IntroPageService) {}
  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createIntroPageDto: CreateIntroPageDto,
    @Body('shopId') shopId: Types.ObjectId,
  ) {
    return this.introPageService.create(createIntroPageDto, shopId);
  }

  @Get(':id')
  findAll(@Param('id') id?: Types.ObjectId) {
    return this.introPageService.findAll(new Types.ObjectId(id));
  }

  @Get('/one/:id')
  findOne(@Param('id') id: string) {
    return this.introPageService.findOne(id);
  }

  @UseGuards(MerchantGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIntroPageDto: UpdateIntroPageDto,
  ) {
    return this.introPageService.update(id, updateIntroPageDto);
  }

  @UseGuards(MerchantGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.introPageService.remove(id);
  }
}
