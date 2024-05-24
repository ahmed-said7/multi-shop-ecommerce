import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Get,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { MerchantGuard } from 'src/auth/guards/merchant.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getUserCart(@Body('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post()
  addToCart(
    @Body('userId') userId: string,
    @Body('shopId') shopId: string,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(userId, shopId, addToCartDto);
  }

  @UseGuards(JwtGuard, MerchantGuard)
  @Delete('/remove/:itemId')
  removeFromCart(
    @Body('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeFromCart(userId, itemId);
  }

  @UseGuards(JwtGuard, MerchantGuard)
  @Put(':userId/update/:itemId')
  updateItemQuantity(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateItemQuantity(userId, itemId, quantity);
  }
}
