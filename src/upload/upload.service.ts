import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
    const res = await cloudinary.uploader.upload(dataURI);
    return res.url;
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const links: string[] = [];
    for (const file of files) {
      const url = await this.uploadFile(file);
      links.push(url);
    }
    return links;
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
