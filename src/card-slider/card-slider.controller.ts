import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CardSliderService } from './card-slider.service';
import { CreateCardSliderDto } from './dto/create-card-slider.dto';
import { UpdateCardSliderDto } from './dto/update-card-slider.dto';

@Controller('card-slider')
export class CardSliderController {
  constructor(private readonly cardSliderService: CardSliderService) {}

  @Post()
  create(@Body() createCardSliderDto: CreateCardSliderDto) {
    return this.cardSliderService.create(createCardSliderDto);
  }

  @Get('shop/:id')
  findAll(@Param('id') id: string) {
    return this.cardSliderService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardSliderService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCardSliderDto: UpdateCardSliderDto,
  ) {
    return this.cardSliderService.update(id, updateCardSliderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardSliderService.remove(id);
  }
}
