import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { User, UserSchema } from 'src/user/schemas/user_schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema } ,{ name: User.name, schema: UserSchema }]),
    
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
