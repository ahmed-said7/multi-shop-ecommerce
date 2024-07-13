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
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { applyCoupon } from './dto/apply-coupon.dto';
import { MerchantUser } from 'utils/extractors/merchant-user.param';
import { MerchantPayload } from 'src/merchant/merchant.service';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { UserRole } from 'src/user/schemas/user_schema';
import { Roles } from 'src/common/decorator/roles';
import { IAuthUser } from 'src/common/enums';
import { AuthUser } from 'src/common/decorator/param.decorator';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  create(
    @Body() createCouponDto: CreateCouponDto,
    @AuthUser() user: IAuthUser,
  ) {
    return this.couponService.create(createCouponDto, user.shopId);
  }

  @UseGuards(JwtGuard)
  @Post('/apply')
  applyCoupon(
    @Body('userId', ValidateObjectIdPipe) userId: string,
    @Body() applyCoupon: applyCoupon,
  ) {
    return this.couponService.applyCoupon(userId, applyCoupon);
  }

  @UseGuards(MerchantGuard)
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
