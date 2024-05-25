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

import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { MerchantGuard } from 'src/auth/guards/merchant.guard';

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
  @Get()
  findAll(
    @Query('sellerId') sellerId?: string,
    @Query('shopId') shopId?: string,
  ) {
    return this.orderService.findAll(sellerId, shopId);
  }

  @UseGuards(JwtGuard, MerchantGuard)
  @Get('my-orders')
  findShopOrders(
    @Body('userId') userId: string,
    @Body('shopId') shopId: string,
  ) {
    return this.orderService.findAll(userId, shopId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @UseGuards(JwtGuard, MerchantGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @UseGuards(JwtGuard, MerchantGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Body('userId') userId: string) {
    return this.orderService.remove(id, userId);
  }
}
