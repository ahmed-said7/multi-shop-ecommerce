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

import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CreateCartItemDto } from './dto/create-cart.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createCartItemDto: CreateCartItemDto,
    @Body('userId') userId: string,
  ) {
    return this.cartService.create({ ...createCartItemDto, userId });
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Body('userId') userId: string, @Body('shopId') shopId: string) {
    return this.cartService.findAll(userId, shopId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
