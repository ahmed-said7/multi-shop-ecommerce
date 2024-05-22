import { Module } from '@nestjs/common';
import { FileManagerService } from './services/file-manager.service';
import { FileManagerController } from './controllers/file-manager.controller';
import { CloudflareR2Communicator } from './communicators/cloudflare-r2.communicator';
import { ItemModule } from 'src/item/item.module';
import { UserModule } from 'src/user/user.module'; // Import UserModule

@Module({
  imports: [
    ItemModule,
    UserModule, // Add UserModule to imports
  ],
  providers: [FileManagerService, CloudflareR2Communicator],
  controllers: [FileManagerController],
  exports: [FileManagerService],
})
export class FileManagerModule {}
