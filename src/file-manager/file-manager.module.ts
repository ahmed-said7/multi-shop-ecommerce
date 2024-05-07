
import { Module } from '@nestjs/common';
import { FileManagerService } from './services/file-manager.service';
import { FileManagerController } from './controllers/file-manager.controller';
import { CloudflareR2Communicator } from './communicators/cloudflare-r2.communicator';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotoSlide, PhotoSlideSchema } from 'src/photo-slide/schemas/photoSlide_schema';
import { Item, ItemSchema } from 'src/item/schemas/item-schema';
import { ItemModule } from 'src/item/item.module';


@Module({
    imports: [
      ItemModule
      ],
    providers: [FileManagerService, CloudflareR2Communicator],
    controllers: [FileManagerController],
    exports: [FileManagerService],
})
export class FileManagerModule {}
