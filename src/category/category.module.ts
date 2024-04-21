import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from './schemas/category_schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/user/schemas/user_schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Shop.name, schema: ShopSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({
      secret: `${process.env.SECRET}`,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
