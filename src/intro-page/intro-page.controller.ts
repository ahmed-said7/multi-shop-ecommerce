import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { IntroPageService } from './intro-page.service';
import { CreateIntroPageDto } from './dto/create-intro-page.dto';
import { UpdateIntroPageDto } from './dto/update-intro-page.dto';

@Controller('intro-page')
export class IntroPageController {
  constructor(private readonly introPageService: IntroPageService) {}

  @Post()
  create(@Body() createIntroPageDto: CreateIntroPageDto) {
    return this.introPageService.create(createIntroPageDto);
  }

  @Get()
  findAll(@Query('shop') shop?: string) {
    return this.introPageService.findAll(shop);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.introPageService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIntroPageDto: UpdateIntroPageDto,
  ) {
    return this.introPageService.update(id, updateIntroPageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.introPageService.remove(id);
  }
}
