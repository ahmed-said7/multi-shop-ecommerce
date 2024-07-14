import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Types } from 'mongoose';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { applyCoupon } from './dto/apply-coupon.dto';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { UserRole } from 'src/user/schemas/user_schema';
import { Roles } from 'src/common/decorator/roles';
import { IAuthUser } from 'src/common/enums';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { QueryCouponDto } from './dto/query-coupon.dto';
@Controller("coupon")
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  create(
    @Body() createCouponDto: CreateCouponDto,
    @AuthUser() user: IAuthUser,
  ) {
    return this.couponService.create(createCouponDto, user.shopId);
  }

  @Post('/apply')
  @UseGuards(AuthenticationGuard)
  applyCoupon(
    @AuthUser("_id") userId: string,
    @Body() applyCoupon: applyCoupon,
  ) {
    return this.couponService.applyCoupon(userId, applyCoupon);
  }


  @Get(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  findAll(
    @AuthUser("shopId" ) shopId: string,
    @Query() query: QueryCouponDto,
  ) {
    return this.couponService.findAll(query, shopId);
  }

  @Get("/one/:id")
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  findOne(
    @Param("id", ValidateObjectIdPipe) id: string,
    @AuthUser("shopId" ) shopId: string
  ) {
    return this.couponService.findOne(id,shopId);
  }


  @Patch(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  update(
    @Param("id", ValidateObjectIdPipe) id: string,
    @Body() updateCouponDto: UpdateCouponDto,
    @AuthUser("shopId" ) shopId: string
  ) {
    return this.couponService.update(id,shopId, updateCouponDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  remove(
    @Param('id', ValidateObjectIdPipe) id: string,
    @AuthUser("shopId" ) shopId: string
  ) {
    return this.couponService.remove(id,shopId);
  }
}
