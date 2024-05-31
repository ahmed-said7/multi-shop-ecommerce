import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private s3Client: S3Client;
  private bucket: string = this.config.get<string>('CLOUDFLARE_R2_BUCKET');
  private accountId: string = this.config.get<string>('CLOUDFLARE_R2_ENDPOINT');
  private accessKeyId: string = this.config.get<string>(
    'CLOUDFLARE_R2_ACCESS_KEY_ID',
  );
  private secretAccessKey: string = this.config.get<string>(
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
  );
  private r2Subdomain: string = this.config.get<string>(
    'CLOUDFLARE_R2_SUBDOMAIN',
  );

  constructor(private config: ConfigService) {
    this.s3Client = new S3Client({
      endpoint: `https://${this.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
      region: 'us-east-1',
    });
  }

  async uploadFile(file: Express.Multer.File, destination: string) {
    try {
      const obj = await this.s3Client.send(
        new PutObjectCommand({
          Body: file.buffer,
          Bucket: this.bucket,
          Key: destination,
          ContentType: file.mimetype,
        }),
      );

      return `${this.r2Subdomain}/${destination}`;
    } catch (error) {
      throw new InternalServerErrorException(`Error while uploading file!`);
    }
  }
  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map((file) => {
        const destination = `${Date.now()}-${file.originalname}`;
        return this.uploadFile(file, destination);
      });
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new InternalServerErrorException(`Error while uploading files!`);
    }
  }
}
