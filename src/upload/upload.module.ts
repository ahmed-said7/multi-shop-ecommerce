import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { extension } from 'mime-types';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './images/',
        filename(_req, file, callback) {
          const nowDate = DateTime.now().toISODate();

          const name = `${file.originalname.split('.').at(0)}-${nowDate}-${uuid()}.${extension(file.mimetype)}`;

          callback(null, name);
        },
      }),
    }),
  ],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
