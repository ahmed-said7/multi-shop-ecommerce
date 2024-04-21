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
import { ReviewContainerService } from './review-container.service';
import { CreateReviewContainerDto } from './dto/create-reviewContainer.dto';
import { UpdateReviewContainerDto } from './dto/update-reviewContainer.dto';

@Controller('review-container')
export class ReviewContainerController {
  constructor(private readonly reviewService: ReviewContainerService) { }

  @Post()
  create(@Body() createReviewDto: CreateReviewContainerDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  findAll(@Query('shop') shop?: string) {
    return this.reviewService.findAll(shop);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewContainerDto,
  ) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
