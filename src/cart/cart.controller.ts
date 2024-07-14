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
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { Roles } from 'src/common/decorator/roles';
import { UserRole } from 'src/user/schemas/user_schema';
import { AuthUser } from 'src/common/decorator/param.decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  
  @Post()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.USER)
  async getUserCart(
    @AuthUser('_id') userId: string,
    @Body('shopId') shopId: string,
  ) {
    return this.cartService.getCart(userId, shopId);
  }

  
  @Post('/add')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.USER)
  addToCart( @Body('userId') userId: string, @Body() item: CreateCartItemDto ) {
    return this.cartService.addToCart(userId, item);
  }

  
  @Delete('/remove/:id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.USER)
  removeFromCart(@Param('id', ValidateObjectIdPipe) cartItemId: string) {
    return this.cartService.removeFromCart(cartItemId);
  };

  
  @Put('/update/:id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.USER)
  updateItemQuantity(
    @Param('id', ValidateObjectIdPipe) itemId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateItemQuantity(itemId, quantity);
  }
}
