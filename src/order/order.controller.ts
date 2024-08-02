import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';

import { OrderService } from './order.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { AllRoles, IAuthUser } from 'src/common/enums';
import { Roles } from 'src/common/decorator/roles';
import { QueryOrderDto } from './dto/order-query.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.USER)
  create(@AuthUser() user: IAuthUser, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(user._id, createOrderDto);
  }

  @Get('/shop')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.ADMIN, AllRoles.USER, AllRoles.MERCHANT)
  findShopOrders(@AuthUser() user: IAuthUser, @Query() query: QueryOrderDto) {
    return this.orderService.findAllOrders(query, user);
  }

  @Get('/me')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.USER)
  findUserOrders(@AuthUser() user: IAuthUser, @Query() query: QueryOrderDto) {
    return this.orderService.findAllOrders(query, user);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.ADMIN, AllRoles.USER, AllRoles.MERCHANT)
  findOne(
    @Param('id', ValidateObjectIdPipe) id: string,
    @AuthUser() user: IAuthUser,
  ) {
    return this.orderService.findOne(id, user);
  }

  @Patch('confirm-deliver/:id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.ADMIN)
  confirmDeliver(
    @Param('id', ValidateObjectIdPipe) id: string,
    // @AuthUser() user: IAuthUser,
  ) {
    return this.orderService.confimeDelivery(id);
  }

  @Patch('confirm-paid/:id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.ADMIN)
  confirmPaid(
    @Param('id', ValidateObjectIdPipe) id: string,
    // @AuthUser() user: IAuthUser,
  ) {
    return this.orderService.confimePaid(id);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.ADMIN)
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.orderService.remove(id);
  }
}
