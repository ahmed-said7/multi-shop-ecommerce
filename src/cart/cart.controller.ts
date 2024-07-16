import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  ParseIntPipe,
  Get,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { Roles } from 'src/common/decorator/roles';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { AllRoles, IAuthUser } from 'src/common/enums';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  
  @Get(":shopId")
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.USER)
  async getUserCart(
    @AuthUser() user: IAuthUser,
    @Param('shopId',ValidateObjectIdPipe) shopId: string,
  ) {
    return this.cartService.getCart(user._id, shopId);
  }

  
  @Post('/add')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.USER)
  addToCart( @AuthUser() user: IAuthUser, @Body() item: AddToCartDto ) {
    return this.cartService.addToCart(user._id, item);
  }

  
  @Delete('/remove/:id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.USER)
  removeFromCart
  (
    @AuthUser() user: IAuthUser,
    @Param('id', ValidateObjectIdPipe) cartItemId: string,
  ) {
    return this.cartService.removeFromCart(cartItemId,user);
  };

  
  @Put('/update/:id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.USER)
  updateItemQuantity(
    @Param('id', ValidateObjectIdPipe) itemId: string,
    @Body('quantity',ParseIntPipe) quantity: number,
    @AuthUser() user: IAuthUser
  ) {
    return this.cartService.updateItemQuantity(itemId, quantity,user);
  }
}
