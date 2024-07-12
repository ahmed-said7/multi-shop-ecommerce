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
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';

@Controller('review-container')
export class ReviewContainerController {
  constructor(private readonly reviewService: ReviewContainerService) {}
  @UseGuards(MerchantGuard)
  @Post()
  create(
    @Body() createReviewDto: CreateReviewContainerDto,
    @MerchantUser() user: MerchantPayload,
  ) {
    return this.reviewService.create(createReviewDto, user.shopId);
  }

  @Get('/shop/:id')
  findAll(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.reviewService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.reviewService.findOne(id);
  }
  @UseGuards(MerchantGuard)
  @Patch(':id')
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateReviewDto: UpdateReviewContainerDto,
  ) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @UseGuards(MerchantGuard)
  @Delete(':id')
  remove(
    @Param('id', ValidateObjectIdPipe) id: string,
    @MerchantUser() user: MerchantPayload,
  ) {
    return this.reviewService.remove(id, user.shopId);
  }
}
