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
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @UseGuards(MerchantGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @UseGuards(MerchantGuard)
  @Patch('confirm/:id')
  confirmDeliver(@Param('id') id: string) {
    return this.orderService.confimeDelivery(id);
  }

  @UseGuards(MerchantGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @MerchantUser() user: MerchantPayload) {
    return this.orderService.remove(id, user.id);
  }
}
