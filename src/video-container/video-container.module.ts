import { Module } from '@nestjs/common';
import { VideoContainerService } from './video-container.service';
import { VideoContainerController } from './video-container.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from 'src/shop/schemas/shop_schema';
import {
  VideoContainer,
  VideoContainerSchema,
} from './schemas/videoContainer-schema';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/user/schemas/user_schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VideoContainer.name, schema: VideoContainerSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({
      secret: `${process.env.SECRET}`,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [VideoContainerController],
  providers: [VideoContainerService],
})
export class VideoContainerModule {}
