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

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createCouponDto: CreateCouponDto,
    @Body('userId') userId: string,
  ) {
    return this.couponService.create(createCouponDto, userId);
  }

  @Get(':id')
  findAll(@Param('id') id: Types.ObjectId, @Query('page') page?: number) {
    return this.couponService.findAll(new Types.ObjectId(id), page);
  }

  @Patch('/discount/:id')
  changeDiscount(
    @Param() id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponService.changeDiscount(
      id,
      updateCouponDto.discountPercentage,
    );
  }

  @Patch('/customers/add')
  addCustomer(
    @Body('id') id: Types.ObjectId,
    @Body('customer') customer: Types.ObjectId,
  ) {
    return this.couponService.addCustomer(id, customer);
  }

  @Patch('/items/add')
  addItem(@Body('id') id: Types.ObjectId, @Body('item') item: Types.ObjectId) {
    return this.couponService.addItem(id, item);
  }

  @Get('/one/:id')
  findOne(@Param('id') id: Types.ObjectId) {
    return this.couponService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: Types.ObjectId,
    @Body('shopId') shopId: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponService.update(id, shopId, updateCouponDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Types.ObjectId, @Body('shopId') shopId: string) {
    return this.couponService.remove(id, shopId);
  }
}
