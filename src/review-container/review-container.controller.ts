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
import { ReviewContainerService } from './review-container.service';
import { CreateReviewContainerDto } from './dto/create-reviewContainer.dto';
import { UpdateReviewContainerDto } from './dto/update-reviewContainer.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Types } from 'mongoose';
import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { MerchantUser } from 'utils/extractors/merchant-user.param';
import { MerchantPayload } from 'src/merchant/merchant.service';

@Controller('review-container')
export class ReviewContainerController {
  constructor(private readonly reviewService: ReviewContainerService) {}
  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createReviewDto: CreateReviewContainerDto,
    @Body('shopId') shopId: string,
  ) {
    return this.reviewService.create(createReviewDto, shopId);
  }

  @Get('/shop/:id')
  findAll(@Param('id') id: Types.ObjectId) {
    return this.reviewService.findAll(new Types.ObjectId(id));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }
  @UseGuards(MerchantGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewContainerDto,
  ) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @UseGuards(MerchantGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @MerchantUser() user: MerchantPayload) {
    return this.reviewService.remove(id, user.shopId);
  }
}
