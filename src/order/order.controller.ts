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

  @Post()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.MERCHANT)
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
    @Body('shopId') shopId: string,
    @Body('userRole') userRole: string,
  ) {
    return this.orderService.findAllShopOrder(shopId, userRole);
  }

  
  @Get('/me')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.MERCHANT)
  findUserOrders(
    @Body('userId') userId: string,
    @Body('shopId') shopId: string,
  ) {
    return this.orderService.findAllUserOrder(userId, shopId);
  }


  @Get(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.MERCHANT)
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.MERCHANT)
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }


  @Patch('confirm/:id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.MERCHANT)
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
