import { Test } from '@nestjs/testing';

import { MongooseModule } from '@nestjs/mongoose';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { UserModule } from '../user/user.module';
import { Shop, ShopSchema } from '../shop/schemas/shop_schema';
import { User, UserSchema } from '../user/schemas/user_schema';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

describe('AdminController', () => {
  let adminsController: AdminController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        JwtModule.register({
          secret: process.env.SECRET,
          signOptions: { expiresIn: '1d' },
          global: true,
        }),
        MongooseModule.forRoot(process.env.DB_URI),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: Shop.name, schema: ShopSchema },
        ]),
        UserModule,
      ],
      controllers: [AdminController],
      providers: [AdminService],
    }).compile();

    adminsController = moduleRef.get<AdminController>(AdminController);
  });

  describe('FindOne', () => {
    it('Should Throw on Invalid ID', async () => {
      let data = null;
      try {
        data = await adminsController.findOne('adafa');
      } catch (error) {
        data = null;
      }

      expect(data).toBeNull();
    });
  });
});
