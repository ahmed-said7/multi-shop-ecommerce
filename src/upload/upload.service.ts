import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { join } from 'path';

import { v2 as cloudinary } from 'cloudinary';

import { rm } from 'fs/promises';

@Injectable()
export class UploadService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: 'dykmqerdt',
      api_key: '914667443463293',
      api_secret: 'SVBMr1Pd6PCXas9DxnAr_86b11E',
      secure: true,
    });
  }

  private readonly filesPath = join(__dirname, '..', '..');

  async uploadFile(file: Express.Multer.File) {
    file.path = join(this.filesPath, file.path);

    const { url } = await cloudinary.uploader.upload(file.path);

    await rm(file.path);

    return url;
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const fileList = files.map((img) => {
      return {
        ...img,
        path: join(this.filesPath, img.path),
      };
    });

    try {
      const links: string[] = [];

      for (const file of fileList) {
        const { url } = await cloudinary.uploader.upload(file.path);
        links.push(url);

        await rm(file.path);
      }

      return links;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async removeFile(path: string) {
    await cloudinary.uploader.destroy(path);

    return 'File Deleted';
  }

  async removeFiles(paths: string[]) {
    await cloudinary.api.delete_resources(paths);

    return 'Files Deleted';
  }
}
