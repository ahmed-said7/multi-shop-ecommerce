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

  @Get()
  findAll(
    @Query('buyerId') buyerId?: string,
    @Query('sellerId') sellerId?: string,
    @Query('shopId') shopId?: string,
  ) {
    return this.orderService.findAll(buyerId, sellerId, shopId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Body('userId') userId: string,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(userId, id, updateOrderDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Body('userId') userId: string) {
    return this.orderService.remove(id, userId);
  }
}
