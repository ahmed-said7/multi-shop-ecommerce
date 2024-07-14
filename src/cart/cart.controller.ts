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
import { CreateCartItemDto } from './dto/create-cart.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  async getUserCart(
    @Body('userId') userId: string,
    @Body('shopId') shopId: string,
  ) {
    return this.cartService.getCart(userId, shopId);
  }

  @UseGuards(AuthenticationGuard)
  @Post('/add')
  addToCart(@Body('userId') userId: string, @Body() item: CreateCartItemDto) {
    return this.cartService.addToCart(userId, item);
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/remove/:id')
  removeFromCart(@Param('id', ValidateObjectIdPipe) cartItemId: string) {
    return this.cartService.removeFromCart(cartItemId);
  }

  @UseGuards(AuthenticationGuard)
  @Put('/update/:id')
  updateItemQuantity(
    @Param('id', ValidateObjectIdPipe) itemId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateItemQuantity(itemId, quantity);
  }
}
