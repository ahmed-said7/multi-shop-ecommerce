import { Test } from '@nestjs/testing';

import { Model, Document, Types } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { UserModule } from '../user/user.module';
import { Shop, ShopSchema } from '../shop/schemas/shop_schema';
import { User, UserDocument, UserSchema } from '../user/schemas/user_schema';

type UserDoc = Document<unknown, any, UserDocument> &
  User &
  Document<any, any, any> & { _id: Types.ObjectId };

describe('AdminController', () => {
  let adminsService: AdminService;
  let adminsController: AdminController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: Shop.name, schema: ShopSchema },
        ]),
        UserModule,
      ],
      controllers: [AdminController],
      providers: [AdminService],
    }).compile();

    adminsService = moduleRef.get<AdminService>(AdminService);
    adminsController = moduleRef.get<AdminController>(AdminController);
  });

  describe('FindOne', () => {
    it('Should Return All', async () => {
      const result: UserDoc = new Model<UserDocument>();

      jest
        .spyOn(adminsService, 'findOne')
        .mockImplementation(() => Promise.resolve(result));

      expect(await adminsController.findOne('adafa')).toBe(result);
    });
  });
});
