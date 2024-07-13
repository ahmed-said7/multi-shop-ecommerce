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

import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { MerchantUser } from 'utils/extractors/merchant-user.param';
import { MerchantPayload } from 'src/merchant/merchant.service';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { UserRole } from 'src/user/schemas/user_schema';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { IAuthUser } from 'src/common/enums';
import { Roles } from 'src/common/decorator/roles';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body('userId') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.create(userId, createOrderDto);
  }

  @UseGuards(JwtGuard)
  @Get('/shop')
  findShopOrders(
    @Body('shopId') shopId: string,
    @Body('userRole') userRole: string,
  ) {
    return this.orderService.findAllShopOrder(shopId, userRole);
  }

  @UseGuards(JwtGuard)
  @Get('/me')
  findUserOrders(
    @Body('userId') userId: string,
    @Body('shopId') shopId: string,
  ) {
    return this.orderService.findAllUserOrder(userId, shopId);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.orderService.findOne(id);
  }

  @UseGuards(MerchantGuard)
  @Patch(':id')
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @UseGuards(MerchantGuard)
  @Patch('confirm/:id')
  confirmDeliver(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.orderService.confimeDelivery(id);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  remove(
    @Param('id', ValidateObjectIdPipe) id: string,
    @AuthUser() user: IAuthUser,
  ) {
    return this.orderService.remove(id, user._id);
  }
}
