import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { CloudflareR2Communicator } from '../communicators/cloudflare-r2.communicator';
import { InjectModel } from '@nestjs/mongoose';
import {
  PhotoSlide,
  PhotoSlideDocument,
} from 'src/photo-slide/schemas/photoSlide_schema';
import { Model } from 'mongoose';
import { ItemService } from 'src/item/item.service';
import { UpdateItemDto } from 'src/item/dto/update-item.dto';

@Injectable()
export class FileManagerService {
  constructor(
    private config: ConfigService,
    private cloudflareR2Communicator: CloudflareR2Communicator,
    private readonly itemService: ItemService,
  ) {}

  async uploadFile(
    file: any,
    itemID: string,
    request: any,
    allowedFormats?: string[],
  ): Promise<any> {
    let defaultFormats = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.heif',
      '.mp4',
      '.mov',
      '.hevc',
    ];

    if (allowedFormats) {
      defaultFormats = allowedFormats;
    }

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!defaultFormats.some((format) => file.originalname.endsWith(format))) {
      throw new BadRequestException('Invalid file format');
    }

    const fileName: string =
      path.parse(file.originalname).name.replace(/\s/g, '') + `-${uuidv4()}`;
    const extension: string = path.parse(file.originalname).ext;
    const filePath: string = `uploads/${fileName}${extension}`;
    const uploadResponse = await this.cloudflareR2Communicator.uploadFile(
      file,
      filePath,
    );
    const updateItemDto: UpdateItemDto = UpdateItemDto;
    updateItemDto.images = [uploadResponse];
    this.itemService.update(itemID, updateItemDto, request);
    
    return uploadResponse;
  }
}
