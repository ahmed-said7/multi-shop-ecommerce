import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

import { Types } from 'mongoose';

import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { ValidateObjectIdPipe } from 'src/pipes/validate-object-id.pipe';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createCouponDto: CreateCouponDto,
    @Body('shopId') shopId: string,
  ) {
    return this.couponService.create(createCouponDto, shopId);
  }

  @UseGuards(JwtGuard)
  @Post('/apply')
  applyCoupon(@Body('userId', ValidateObjectIdPipe) userId: string) {
    // return this.couponService.applyCoupon(userId, applyCoupon);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findAll(
    @Param('id', ValidateObjectIdPipe) id: Types.ObjectId,
    @Query('page') page?: number,
  ) {
    return this.couponService.findAll(new Types.ObjectId(id), page);
  }

  @Get('/one/:id')
  findOne(@Param('id', ValidateObjectIdPipe) id: Types.ObjectId) {
    return this.couponService.findOne(id);
  }

  @UseGuards(MerchantGuard)
  @Patch(':id')
  update(
    @Param('id', ValidateObjectIdPipe) id: Types.ObjectId,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponService.update(id, updateCouponDto);
  }

  @UseGuards(MerchantGuard)
  @Delete(':id')
  remove(@Param('id', ValidateObjectIdPipe) id: Types.ObjectId) {
    return this.couponService.remove(id);
  }
}
