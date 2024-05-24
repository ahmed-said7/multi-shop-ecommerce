import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { User, UserSchema } from 'src/user/schemas/user_schema';
import { Shop, ShopSchema, } from 'src/shop/schemas/shop_schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema } ,{ name: User.name, schema: UserSchema }, {name: Shop.name, schema: ShopSchema}]),
    
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
