import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CartItem, CartItemSchema } from './schemas/cart-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CartItem.name, schema: CartItemSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
