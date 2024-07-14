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
import { UpdateOrderDto } from './dto/update-order.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { UserRole } from 'src/user/schemas/user_schema';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { IAuthUser } from 'src/common/enums';
import { Roles } from 'src/common/decorator/roles';
import { QueryOrderDto } from './dto/order-query.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.USER)
  create(
    @Body('userId') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.create(userId, createOrderDto);
  }

  @Get('/shop')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.MERCHANT)
  findShopOrders(
    @AuthUser() user: IAuthUser,
    @Query() query:QueryOrderDto 
  ) {
    return this.orderService.findAllShopOrder(query,user);
  }

  
  @Get('/me')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.USER)
  findUserOrders(
    @AuthUser() user: IAuthUser,
    @Query() query:QueryOrderDto 
  ) {
    return this.orderService.findAllShopOrder(query, user);
  }


  @Get(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.MERCHANT)
  findOne(
    @Param('id', ValidateObjectIdPipe) id: string,
    @AuthUser() user: IAuthUser
  ) {
    return this.orderService.findOne(id,user);
  };

  @Patch('confirm-deliver/:id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN)
  confirmDeliver(
    @Param('id', ValidateObjectIdPipe) id: string,
    @AuthUser() user: IAuthUser
  ) {
    return this.orderService.confimeDelivery(id,user);
  };

  @Patch('confirm-paid/:id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN)
  confirmPaid(
    @Param('id', ValidateObjectIdPipe) id: string,
    @AuthUser() user: IAuthUser
  ) {
    return this.orderService.confimeDelivery(id,user);
  };

  @Delete(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN)
  remove(
    @Param('id', ValidateObjectIdPipe) id: string
  ) {
    return this.orderService.remove(id);
  };

}
