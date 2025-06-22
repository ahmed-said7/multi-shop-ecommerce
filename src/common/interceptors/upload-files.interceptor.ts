import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { UploadService } from 'src/upload/upload.service';
@Injectable()
export class UploadMultibleFilesInterceptor implements NestInterceptor {
  constructor(
    @Inject('field') private field: string,
    private uploadService: UploadService,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const req = context.switchToHttp().getRequest<Request>();
    const { files } = req;
    if (!files || !Array.isArray(files)) {
      return next.handle();
    }
    req.body[this.field] = await this.uploadService.uploadFiles(files);
    return next.handle();
  }
}
