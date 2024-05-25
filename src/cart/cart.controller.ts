import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCartItemDto } from './dto/create-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtGuard)
  @Post()
  async getUserCart(
    @Body('userId') userId: string,
    @Body('shopId') shopId: string,
  ) {
    return this.cartService.getCart(userId, shopId);
  }

  @UseGuards(JwtGuard)
  @Post()
  addToCart(@Body('userId') userId: string, @Body() item: CreateCartItemDto) {
    return this.cartService.addToCart(userId, item);
  }

  @UseGuards(JwtGuard)
  @Delete('/remove/:id')
  removeFromCart(@Param('id') cartItemId: string) {
    return this.cartService.removeFromCart(cartItemId);
  }

  @UseGuards(JwtGuard)
  @Put('/update/:id')
  updateItemQuantity(
    @Param('id') itemId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateItemQuantity(itemId, quantity);
  }
}
