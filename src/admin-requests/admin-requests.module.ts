import { Module } from '@nestjs/common';
import { AdminRequestsService } from './admin-requests.service';
import { AdminRequestsController } from './admin-requests.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user_schema';
import {
  AdminRequest,
  AdminRequestSchema,
} from './schemas/admin_request_schema';
import { Merchant, merchantSchema } from 'src/merchant/schema/merchant.schema';
import { ApiModule } from 'src/common/filter/api.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Merchant.name, schema: merchantSchema },
      { name: AdminRequest.name, schema: AdminRequestSchema },
    ]),
    ApiModule
  ],
  controllers: [AdminRequestsController],
  providers: [AdminRequestsService],
})
export class AdminRequestsModule {}
